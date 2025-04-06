from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ReturnDocument
from pydantic import BaseModel, Field, GetCoreSchemaHandler, GetJsonSchemaHandler
from typing import List, Optional, Dict, Any, Annotated
from datetime import datetime
from bson import ObjectId
import os
from dotenv import load_dotenv
from pydantic_core import core_schema

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="Hospital Management System API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
uri = os.getenv("mongo_uri") # Replace with your local MongoDB URI if different

# MongoDB database object
db = None

@app.on_event("startup")
async def startup_db_client():
    global db
    mongo_client = AsyncIOMotorClient(uri)
    db = mongo_client.hospital_db
    
    # Test connection
    try:
        await mongo_client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_db_client():
    global db
    if db is not None:
        db.client.close()

# PyObjectId for MongoDB ObjectId handling - Compatible with Pydantic v2
class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, 
        _source_type: Any,
        _handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.with_info_plain_validator_function(
            cls.validate,
            serialization=core_schema.str_schema(),
            metadata={"type": "string"}
        )
    
    @classmethod
    def validate(cls, value, info):
        if not ObjectId.is_valid(str(value)):
            raise ValueError(f"Invalid ObjectId: {value}")
        return str(ObjectId(value))
    
    @classmethod
    def __get_pydantic_json_schema__(
        cls,
        _schema: Any, 
        handler: GetJsonSchemaHandler
    ) -> dict[str, Any]:
        schema = handler.resolve_ref_schema(handler.schema_type)
        schema.update(type="string")
        return schema

# Base Models with Pydantic v2 compatibility
class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    contact: str
    address: str
    blood_type: Optional[str] = None
    medical_history: Optional[str] = None
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: Annotated[str, Field(alias="_id", default=None)]
    admission_date: datetime = Field(default_factory=datetime.now)

class VitalSigns(BaseModel):
    temperature: Optional[float] = None
    blood_pressure: Optional[str] = None
    heart_rate: Optional[int] = None
    respiratory_rate: Optional[int] = None
    oxygen_saturation: Optional[float] = None
    glucose_level: Optional[float] = None
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }

class MedicalRecord(BaseModel):
    date: datetime = Field(default_factory=datetime.now)
    diagnosis: Optional[str] = None
    treatment: Optional[str] = None
    medication: Optional[List[str]] = None
    notes: Optional[str] = None
    vital_signs: Optional[VitalSigns] = None
    attending_doctor_id: Optional[str] = None
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }

class PatientDetailsBase(BaseModel):
    patient_id: str
    emergency_contact: Optional[str] = None
    insurance_info: Optional[Dict[str, Any]] = None
    allergies: Optional[List[str]] = None
    current_medication: Optional[List[str]] = None
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }

class PatientDetails(PatientDetailsBase):
    id: Annotated[str, Field(alias="_id", default=None)]

class PatientHistoryBase(BaseModel):
    patient_id: str
    medical_records: List[MedicalRecord] = []
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }

class PatientHistory(PatientHistoryBase):
    id: Annotated[str, Field(alias="_id", default=None)]

class DoctorBase(BaseModel):
    name: str
    specialization: str
    contact: str
    email: str
    schedule: Optional[dict] = None
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }

class DoctorCreate(DoctorBase):
    pass

class Doctor(DoctorBase):
    id: Annotated[str, Field(alias="_id", default=None)]

class AppointmentBase(BaseModel):
    patient_id: str
    doctor_id: str
    date: datetime
    status: str = "scheduled"  # scheduled, completed, cancelled
    notes: Optional[str] = None
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: Annotated[str, Field(alias="_id", default=None)]

# Patient endpoints
@app.post("/patients/", response_model=Patient, status_code=status.HTTP_201_CREATED)
async def create_patient(patient: PatientCreate):
    patient_dict = patient.model_dump()
    patient_dict["admission_date"] = datetime.now()
    new_patient = await db.patients.insert_one(patient_dict)
    created_patient = await db.patients.find_one({"_id": new_patient.inserted_id})
    created_patient["_id"] = str(created_patient["_id"])
    return created_patient

@app.get("/patients/", response_model=List[Patient])
async def get_patients():
    patients = await db.patients.find().to_list(1000)
    for patient in patients:
        patient["_id"] = str(patient["_id"])
    return patients

@app.get("/patients/{patient_id}", response_model=Patient)
async def get_patient(patient_id: str):
    if not ObjectId.is_valid(patient_id):
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    patient = await db.patients.find_one({"_id": ObjectId(patient_id)})
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    patient["_id"] = str(patient["_id"])
    return patient

@app.put("/patients/{patient_id}", response_model=Patient)
async def update_patient(patient_id: str, patient: PatientBase):
    if not ObjectId.is_valid(patient_id):
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    patient_dict = patient.model_dump()
    updated_patient = await db.patients.find_one_and_update(
        {"_id": ObjectId(patient_id)},
        {"$set": patient_dict},
        return_document=ReturnDocument.AFTER
    )
    
    if updated_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    updated_patient["_id"] = str(updated_patient["_id"])
    return updated_patient

@app.delete("/patients/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(patient_id: str):
    if not ObjectId.is_valid(patient_id):
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    deleted = await db.patients.delete_one({"_id": ObjectId(patient_id)})
    
    if deleted.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return None

# Patient Details endpoints
@app.post("/patient-details/", response_model=PatientDetails, status_code=status.HTTP_201_CREATED)
async def create_patient_details(patient_details: PatientDetailsBase):
    # Validate patient existence
    if not ObjectId.is_valid(patient_details.patient_id):
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    patient = await db.patients.find_one({"_id": ObjectId(patient_details.patient_id)})
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Check if details already exist
    existing = await db.patient_details.find_one({"patient_id": patient_details.patient_id})
    if existing:
        raise HTTPException(status_code=400, detail="Patient details already exist")
    
    patient_details_dict = patient_details.model_dump()
    new_details = await db.patient_details.insert_one(patient_details_dict)
    created_details = await db.patient_details.find_one({"_id": new_details.inserted_id})
    created_details["_id"] = str(created_details["_id"])
    return created_details

@app.get("/patient-details/{patient_id}", response_model=PatientDetails)
async def get_patient_details(patient_id: str):
    if not ObjectId.is_valid(patient_id):
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    patient_details = await db.patient_details.find_one({"patient_id": patient_id})
    if patient_details is None:
        raise HTTPException(status_code=404, detail="Patient details not found")
    
    patient_details["_id"] = str(patient_details["_id"])
    return patient_details

@app.put("/patient-details/{patient_id}", response_model=PatientDetails)
async def update_patient_details(patient_id: str, patient_details: PatientDetailsBase):
    if not ObjectId.is_valid(patient_id):
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    patient_details_dict = patient_details.model_dump(exclude={"patient_id"})
    updated_details = await db.patient_details.find_one_and_update(
        {"patient_id": patient_id},
        {"$set": patient_details_dict},
        return_document=ReturnDocument.AFTER
    )
    
    if updated_details is None:
        raise HTTPException(status_code=404, detail="Patient details not found")
    
    updated_details["_id"] = str(updated_details["_id"])
    return updated_details

# Patient History endpoints
@app.post("/patient-history/", response_model=PatientHistory, status_code=status.HTTP_201_CREATED)
async def create_patient_history(patient_history: PatientHistoryBase):
    # Validate patient existence
    if not ObjectId.is_valid(patient_history.patient_id):
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    patient = await db.patients.find_one({"_id": ObjectId(patient_history.patient_id)})
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Check if history already exists
    existing = await db.patient_history.find_one({"patient_id": patient_history.patient_id})
    if existing:
        raise HTTPException(status_code=400, detail="Patient history already exists")
    
    patient_history_dict = patient_history.model_dump()
    new_history = await db.patient_history.insert_one(patient_history_dict)
    created_history = await db.patient_history.find_one({"_id": new_history.inserted_id})
    created_history["_id"] = str(created_history["_id"])
    return created_history

@app.get("/patient-history/{patient_id}", response_model=PatientHistory)
async def get_patient_history(patient_id: str):
    if not ObjectId.is_valid(patient_id):
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    patient_history = await db.patient_history.find_one({"patient_id": patient_id})
    if patient_history is None:
        raise HTTPException(status_code=404, detail="Patient history not found")
    
    patient_history["_id"] = str(patient_history["_id"])
    return patient_history

@app.put("/patient-history/{patient_id}/add-record", response_model=PatientHistory)
async def add_medical_record(patient_id: str, medical_record: MedicalRecord):
    if not ObjectId.is_valid(patient_id):
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    # Validate doctor if provided
    if medical_record.attending_doctor_id and ObjectId.is_valid(medical_record.attending_doctor_id):
        doctor = await db.doctors.find_one({"_id": ObjectId(medical_record.attending_doctor_id)})
        if doctor is None:
            raise HTTPException(status_code=404, detail="Doctor not found")
    
    medical_record_dict = medical_record.model_dump()
    
    # First check if patient history exists
    patient_history = await db.patient_history.find_one({"patient_id": patient_id})
    
    if patient_history is None:
        # Create new history with this record
        new_history = {
            "patient_id": patient_id,
            "medical_records": [medical_record_dict]
        }
        result = await db.patient_history.insert_one(new_history)
        created_history = await db.patient_history.find_one({"_id": result.inserted_id})
        created_history["_id"] = str(created_history["_id"])
        return created_history
    else:
        # Update existing history
        updated_history = await db.patient_history.find_one_and_update(
            {"patient_id": patient_id},
            {"$push": {"medical_records": medical_record_dict}},
            return_document=ReturnDocument.AFTER
        )
        updated_history["_id"] = str(updated_history["_id"])
        return updated_history

# Doctor endpoints
@app.post("/doctors/", response_model=Doctor, status_code=status.HTTP_201_CREATED)
async def create_doctor(doctor: DoctorCreate):
    new_doctor = await db.doctors.insert_one(doctor.model_dump())
    created_doctor = await db.doctors.find_one({"_id": new_doctor.inserted_id})
    created_doctor["_id"] = str(created_doctor["_id"])
    return created_doctor

@app.get("/doctors/", response_model=List[Doctor])
async def get_doctors():
    doctors = await db.doctors.find().to_list(1000)
    for doctor in doctors:
        doctor["_id"] = str(doctor["_id"])
    return doctors

@app.get("/doctors/{doctor_id}", response_model=Doctor)
async def get_doctor(doctor_id: str):
    if not ObjectId.is_valid(doctor_id):
        raise HTTPException(status_code=400, detail="Invalid doctor ID format")
    
    doctor = await db.doctors.find_one({"_id": ObjectId(doctor_id)})
    if doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    doctor["_id"] = str(doctor["_id"])
    return doctor

@app.put("/doctors/{doctor_id}", response_model=Doctor)
async def update_doctor(doctor_id: str, doctor: DoctorBase):
    if not ObjectId.is_valid(doctor_id):
        raise HTTPException(status_code=400, detail="Invalid doctor ID format")
    
    doctor_dict = doctor.model_dump()
    updated_doctor = await db.doctors.find_one_and_update(
        {"_id": ObjectId(doctor_id)},
        {"$set": doctor_dict},
        return_document=ReturnDocument.AFTER
    )
    
    if updated_doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    updated_doctor["_id"] = str(updated_doctor["_id"])
    return updated_doctor

@app.delete("/doctors/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_doctor(doctor_id: str):
    if not ObjectId.is_valid(doctor_id):
        raise HTTPException(status_code=400, detail="Invalid doctor ID format")
    
    deleted = await db.doctors.delete_one({"_id": ObjectId(doctor_id)})
    
    if deleted.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    return None

# Appointment endpoints
@app.post("/appointments/", response_model=Appointment, status_code=status.HTTP_201_CREATED)
async def create_appointment(appointment: AppointmentCreate):
    # Validate patient and doctor existence
    if not ObjectId.is_valid(appointment.patient_id):
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    if not ObjectId.is_valid(appointment.doctor_id):
        raise HTTPException(status_code=400, detail="Invalid doctor ID format")
    
    patient = await db.patients.find_one({"_id": ObjectId(appointment.patient_id)})
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    doctor = await db.doctors.find_one({"_id": ObjectId(appointment.doctor_id)})
    if doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Convert the string date to a datetime object
    try:
        appointment_date = datetime.fromisoformat(appointment.date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")
    
    appointment_dict = appointment.model_dump()
    appointment_dict['date'] = appointment_date  # Assign the parsed datetime
    new_appointment = await db.appointments.insert_one(appointment_dict)
    created_appointment = await db.appointments.find_one({"_id": new_appointment.inserted_id})
    created_appointment["_id"] = str(created_appointment["_id"])
    return created_appointment

@app.get("/appointments/", response_model=List[Appointment])
async def get_appointments():
    appointments = await db.appointments.find().to_list(1000)
    for appointment in appointments:
        appointment["_id"] = str(appointment["_id"])
    return appointments

@app.get("/appointments/{appointment_id}", response_model=Appointment)
async def get_appointment(appointment_id: str):
    if not ObjectId.is_valid(appointment_id):
        raise HTTPException(status_code=400, detail="Invalid appointment ID format")
    
    appointment = await db.appointments.find_one({"_id": ObjectId(appointment_id)})
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment["_id"] = str(appointment["_id"])
    return appointment

@app.put("/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: str, appointment: AppointmentBase):
    if not ObjectId.is_valid(appointment_id):
        raise HTTPException(status_code=400, detail="Invalid appointment ID format")
    
    appointment_dict = appointment.model_dump()
    updated_appointment = await db.appointments.find_one_and_update(
        {"_id": ObjectId(appointment_id)},
        {"$set": appointment_dict},
        return_document=ReturnDocument.AFTER
    )
    
    if updated_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    updated_appointment["_id"] = str(updated_appointment["_id"])
    return updated_appointment

@app.delete("/appointments/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(appointment_id: str):
    if not ObjectId.is_valid(appointment_id):
        raise HTTPException(status_code=400, detail="Invalid appointment ID format")
    
    deleted = await db.appointments.delete_one({"_id": ObjectId(appointment_id)})
    
    if deleted.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    return None

# Get appointments by patient
@app.get("/appointments/patient/{patient_id}", response_model=List[Appointment])
async def get_patient_appointments(patient_id: str):
    if not ObjectId.is_valid(patient_id):
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    appointments = await db.appointments.find({"patient_id": patient_id}).to_list(1000)
    for appointment in appointments:
        appointment["_id"] = str(appointment["_id"])
    return appointments

# Get appointments by doctor
@app.get("/appointments/doctor/{doctor_id}", response_model=List[Appointment])
async def get_doctor_appointments(doctor_id: str):
    if not ObjectId.is_valid(doctor_id):
        raise HTTPException(status_code=400, detail="Invalid doctor ID format")
    
    appointments = await db.appointments.find({"doctor_id": doctor_id}).to_list(1000)
    for appointment in appointments:
        appointment["_id"] = str(appointment["_id"])
    return appointments

# Dashboard statistics endpoints
@app.get("/dashboard/stats")
async def get_dashboard_stats():
    total_patients = await db.patients.count_documents({})
    total_doctors = await db.doctors.count_documents({})
    total_appointments = await db.appointments.count_documents({})
    
    # Get appointments by status
    pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    appointments_by_status = await db.appointments.aggregate(pipeline).to_list(1000)
    
    # Format the status counts into a dictionary
    status_counts = {item["_id"]: item["count"] for item in appointments_by_status}
    
    # Recent patients (last 5)
    recent_patients = await db.patients.find().sort("admission_date", -1).limit(5).to_list(5)
    for patient in recent_patients:
        patient["_id"] = str(patient["_id"])
    
    # Today's appointments
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow = today.replace(day=today.day + 1)
    
    todays_appointments = await db.appointments.find({
        "date": {"$gte": today, "$lt": tomorrow}
    }).to_list(1000)
    
    for appointment in todays_appointments:
        appointment["_id"] = str(appointment["_id"])
    
    return {
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "total_appointments": total_appointments,
        "appointments_by_status": status_counts,
        "recent_patients": recent_patients,
        "todays_appointments": todays_appointments
    }

# Additional endpoint: Full patient summary (combines patient, details, and history)
@app.get("/patients/{patient_id}/full-summary")
async def get_patient_full_summary(patient_id: str):
    if not ObjectId.is_valid(patient_id):
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    # Get basic patient info
    patient = await db.patients.find_one({"_id": ObjectId(patient_id)})
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Get patient details
    patient_details = await db.patient_details.find_one({"patient_id": patient_id})
    
    # Get patient history
    patient_history = await db.patient_history.find_one({"patient_id": patient_id})
    
    # Get appointments
    appointments = await db.appointments.find({"patient_id": patient_id}).to_list(100)
    
    # Convert ObjectId to string for serialization
    patient["_id"] = str(patient["_id"])
    
    if patient_details:
        patient_details["_id"] = str(patient_details["_id"])
    
    if patient_history:
        patient_history["_id"] = str(patient_history["_id"])
    
    for appointment in appointments:
        appointment["_id"] = str(appointment["_id"])
    
    return {
        "patient": patient,
        "details": patient_details,
        "history": patient_history,
        "appointments": appointments
    }

# Search endpoints
@app.get("/search/patients")
async def search_patients(query: str):
    # Search patients by name, contact, or address
    results = await db.patients.find({
        "$or": [
            {"name": {"$regex": query, "$options": "i"}},
            {"contact": {"$regex": query, "$options": "i"}},
            {"address": {"$regex": query, "$options": "i"}}
        ]
    }).to_list(20)
    
    for result in results:
        result["_id"] = str(result["_id"])
    
    return results

@app.get("/search/doctors")
async def search_doctors(query: str):
    # Search doctors by name, specialization, or email
    results = await db.doctors.find({
        "$or": [
            {"name": {"$regex": query, "$options": "i"}},
            {"specialization": {"$regex": query, "$options": "i"}},
            {"email": {"$regex": query, "$options": "i"}}
        ]
    }).to_list(20)
    
    for result in results:
        result["_id"] = str(result["_id"])
    
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)