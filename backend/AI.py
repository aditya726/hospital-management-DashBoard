from pydantic import BaseModel
from typing import Optional, List
import ollama
import re
import os
from fastapi import APIRouter, HTTPException
from datetime import datetime

# AI Router
ai_router = APIRouter(prefix="/ai", tags=["AI Assistant"])

class AIQuery(BaseModel):
    query: str
    patient_id: Optional[str] = None
    context: Optional[str] = None

class AIResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = None
    timestamp: datetime = datetime.now()

# Preprocess query to make it more health-focused
def preprocess_query(query: str, context: Optional[str] = None) -> str:
    # Add context if available
    if context:
        return f"Context: {context}\n\nUser query: {query}"
    return query

# Extract and clean AI response
def postprocess_response(response: str) -> str:
    # Remove any unwanted markers or tags
    response = re.sub(r'<.*?>', '', response)
    return response.strip()

@ai_router.post("/query", response_model=AIResponse)
async def query_ai_assistant(query: AIQuery):
    try:
        # Create a health-focused system prompt
        system_prompt = """You are a helpful health information assistant for a hospital management system.
        Provide accurate general health information and always recommend consulting 
        with healthcare professionals for personal medical advice.
        Do not diagnose conditions, prescribe medications, or provide treatment plans.
        Be clear about the limitations of AI assistance in healthcare.
        
        When responding to queries about hospital operations, patient records, or appointments,
        provide helpful information based on general healthcare best practices.
        """
        
        # Add patient context if patient_id is provided
        processed_query = preprocess_query(query.query, query.context)
        
        # Check if Ollama is available and model is loaded
        try:
            # Call the Ollama API with the Gemma 3 1B model
            response = ollama.chat(
                model='gemma3:1b',
                messages=[
                    {
                        'role': 'system',
                        'content': system_prompt
                    },
                    {
                        'role': 'user',
                        'content': processed_query
                    }
                ]
            )
            
            # Extract and clean the response
            assistant_response = response['message']['content']
            cleaned_response = postprocess_response(assistant_response)
            
            return AIResponse(
                response=cleaned_response,
                sources=["Gemma 3 1B via Ollama"],
                timestamp=datetime.now()
            )
            
        except Exception as e:
            # Fallback response if Ollama is not available
            return AIResponse(
                response="I'm sorry, I'm currently unable to process your request. The AI service might be unavailable. Please try again later or contact system administrator.",
                sources=["Error fallback"],
                timestamp=datetime.now()
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Assistant error: {str(e)}")

# Function to get patient-specific context from the database
async def get_patient_context(db, patient_id: str) -> str:
    """
    Retrieve relevant patient information to provide context for AI queries
    """
    try:
        # Get basic patient info
        patient = await db.patients.find_one({"PatientId": patient_id})
        if patient is None:
            return "Patient not found in records."
        
        # Get patient history
        patient_history = await db.patient_history.find_one({"patient_id": patient_id})
        
        context = f"Patient: {patient['name']}, Age: {patient['age']}, Gender: {patient['gender']}"
        
        if patient.get('medical_history'):
            context += f"\nMedical History: {patient['medical_history']}"
            
        if patient.get('blood_type'):
            context += f"\nBlood Type: {patient['blood_type']}"
        
        if patient_history and patient_history.get('medical_records'):
            # Add recent diagnoses and treatments
            recent_records = patient_history['medical_records'][-3:]  # Last 3 records
            context += "\nRecent medical records:"
            
            for record in recent_records:
                date = record.get('date', 'Unknown date')
                diagnosis = record.get('diagnosis', 'No diagnosis')
                treatment = record.get('treatment', 'No treatment')
                
                context += f"\n- Date: {date}, Diagnosis: {diagnosis}, Treatment: {treatment}"
        
        return context
        
    except Exception as e:
        # Return basic context if there's an error
        return f"Limited patient information available. Error: {str(e)}"

# Add patient-specific query endpoint
@ai_router.post("/patient/{patient_id}/query", response_model=AIResponse)
async def query_ai_about_patient(patient_id: str, query: AIQuery, db=None):
    # Get patient context
    patient_context = await get_patient_context(db, patient_id)
    
    # Update query with patient context
    query.context = patient_context
    
    # Process the query with the AI
    return await query_ai_assistant(query)