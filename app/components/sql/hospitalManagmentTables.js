// Patients table
export const patientsTable = [
    { patient_id: 1, name: "John Doe", dob: "1980-05-15", gender: "Male", contact_info: "johndoe@email.com, 555-1234", medical_history: "Hypertension, Diabetes" },
    { patient_id: 2, name: "Jane Smith", dob: "1992-08-22", gender: "Female", contact_info: "janesmith@email.com, 555-5678", medical_history: "Asthma" },
    { patient_id: 3, name: "Robert Johnson", dob: "1975-11-30", gender: "Male", contact_info: "rjohnson@email.com, 555-9012", medical_history: "Arthritis" },
    { patient_id: 4, name: "Emily Brown", dob: "1988-03-17", gender: "Female", contact_info: "emilybrown@email.com, 555-3456", medical_history: "Migraines" },
    { patient_id: 5, name: "Michael Wilson", dob: "1965-09-08", gender: "Male", contact_info: "mwilson@email.com, 555-7890", medical_history: "Heart Disease" },
    { patient_id: 6, name: "Sarah Davis", dob: "1990-12-25", gender: "Female", contact_info: "sarahdavis@email.com, 555-2345", medical_history: "None" }
  ];
  
  // Doctors table
  export const doctorsTable = [
    { doctor_id: 1, name: "Dr. Alice Johnson", specialization: "Cardiology", contact_info: "alicejohnson@hospital.com, 555-1111", schedule: "Mon-Fri, 9AM-5PM" },
    { doctor_id: 2, name: "Dr. David Lee", specialization: "Pediatrics", contact_info: "davidlee@hospital.com, 555-2222", schedule: "Mon-Thu, 8AM-4PM" },
    { doctor_id: 3, name: "Dr. Emma Watson", specialization: "Neurology", contact_info: "emmawatson@hospital.com, 555-3333", schedule: "Tue-Sat, 10AM-6PM" },
    { doctor_id: 4, name: "Dr. James Brown", specialization: "Orthopedics", contact_info: "jamesbrown@hospital.com, 555-4444", schedule: "Mon-Fri, 7AM-3PM" },
    { doctor_id: 5, name: "Dr. Olivia Martinez", specialization: "Dermatology", contact_info: "oliviamartinez@hospital.com, 555-5555", schedule: "Wed-Sun, 9AM-5PM" }
  ];
  
  // Appointments table
  export const appointmentsTable = [
    { appointment_id: 1, patient_id: 1, doctor_id: 1, date_time: "2023-06-01 10:00:00", reason: "Annual checkup" },
    { appointment_id: 2, patient_id: 2, doctor_id: 2, date_time: "2023-06-02 14:30:00", reason: "Flu symptoms" },
    { appointment_id: 3, patient_id: 3, doctor_id: 4, date_time: "2023-06-03 11:15:00", reason: "Joint pain" },
    { appointment_id: 4, patient_id: 4, doctor_id: 3, date_time: "2023-06-04 09:45:00", reason: "Severe headache" },
    { appointment_id: 5, patient_id: 5, doctor_id: 1, date_time: "2023-06-05 13:00:00", reason: "Heart palpitations" },
    { appointment_id: 6, patient_id: 6, doctor_id: 5, date_time: "2023-06-06 15:30:00", reason: "Skin rash" },
    { appointment_id: 7, patient_id: 1, doctor_id: 4, date_time: "2023-06-07 10:30:00", reason: "Back pain" }
  ];
  
  // Medical Records table
  export const medicalRecordsTable = [
    { record_id: 1, patient_id: 1, doctor_id: 1, diagnosis: "Hypertension", treatment: "Prescribed ACE inhibitors", date: "2023-06-01" },
    { record_id: 2, patient_id: 2, doctor_id: 2, diagnosis: "Influenza", treatment: "Rest and fluids, antiviral medication", date: "2023-06-02" },
    { record_id: 3, patient_id: 3, doctor_id: 4, diagnosis: "Osteoarthritis", treatment: "Physical therapy, pain management", date: "2023-06-03" },
    { record_id: 4, patient_id: 4, doctor_id: 3, diagnosis: "Chronic migraine", treatment: "Prescribed preventive medication", date: "2023-06-04" },
    { record_id: 5, patient_id: 5, doctor_id: 1, diagnosis: "Atrial fibrillation", treatment: "Anticoagulation therapy", date: "2023-06-05" },
    { record_id: 6, patient_id: 6, doctor_id: 5, diagnosis: "Eczema", treatment: "Topical corticosteroids", date: "2023-06-06" },
    { record_id: 7, patient_id: 1, doctor_id: 4, diagnosis: "Lumbar strain", treatment: "Physical therapy, NSAIDs", date: "2023-06-07" }
  ];
  
  // Departments table
  export const departmentsTable = [
    { department_id: 1, name: "Cardiology", head_doctor_id: 1 },
    { department_id: 2, name: "Pediatrics", head_doctor_id: 2 },
    { department_id: 3, name: "Neurology", head_doctor_id: 3 },
    { department_id: 4, name: "Orthopedics", head_doctor_id: 4 },
    { department_id: 5, name: "Dermatology", head_doctor_id: 5 },
    { department_id: 6, name: "Emergency", head_doctor_id: null }
  ];
  
  // Prescriptions table
  export const prescriptionsTable = [
    { prescription_id: 1, patient_id: 1, doctor_id: 1, medication: "Lisinopril", dosage: "10mg", instructions: "Once daily", date: "2023-06-01" },
    { prescription_id: 2, patient_id: 2, doctor_id: 2, medication: "Oseltamivir", dosage: "75mg", instructions: "Twice daily for 5 days", date: "2023-06-02" },
    { prescription_id: 3, patient_id: 3, doctor_id: 4, medication: "Ibuprofen", dosage: "400mg", instructions: "As needed for pain", date: "2023-06-03" },
    { prescription_id: 4, patient_id: 4, doctor_id: 3, medication: "Topiramate", dosage: "50mg", instructions: "Once daily at bedtime", date: "2023-06-04" },
    { prescription_id: 5, patient_id: 5, doctor_id: 1, medication: "Warfarin", dosage: "5mg", instructions: "Once daily, regular blood tests required", date: "2023-06-05" },
    { prescription_id: 6, patient_id: 6, doctor_id: 5, medication: "Hydrocortisone cream", dosage: "1%", instructions: "Apply to affected areas twice daily", date: "2023-06-06" },
    { prescription_id: 7, patient_id: 1, doctor_id: 4, medication: "Naproxen", dosage: "500mg", instructions: "Twice daily with food", date: "2023-06-07" }
  ];
  
  // Billing table
  export const billingTable = [
    { bill_id: 1, patient_id: 1, total_amount: 150.00, payment_status: "Paid", bill_date: "2023-06-01" },
    { bill_id: 2, patient_id: 2, total_amount: 200.00, payment_status: "Pending", bill_date: "2023-06-02" },
    { bill_id: 3, patient_id: 3, total_amount: 300.00, payment_status: "Paid", bill_date: "2023-06-03" },
    { bill_id: 4, patient_id: 4, total_amount: 250.00, payment_status: "Paid", bill_date: "2023-06-04" },
    { bill_id: 5, patient_id: 5, total_amount: 500.00, payment_status: "Pending", bill_date: "2023-06-05" },
    { bill_id: 6, patient_id: 6, total_amount: 175.00, payment_status: "Paid", bill_date: "2023-06-06" },
    { bill_id: 7, patient_id: 1, total_amount: 225.00, payment_status: "Pending", bill_date: "2023-06-07" }
  ];
  
  // Staff table
  export const staffTable = [
    { staff_id: 1, name: "Nurse Sarah Johnson", position: "Registered Nurse", department_id: 1, contact_info: "sarahjohnson@hospital.com, 555-6666" },
    { staff_id: 2, name: "Tech John Smith", position: "Lab Technician", department_id: 3, contact_info: "johnsmith@hospital.com, 555-7777" },
    { staff_id: 3, name: "Admin Mary Brown", position: "Receptionist", department_id: null, contact_info: "marybrown@hospital.com, 555-8888" },
    { staff_id: 4, name: "Nurse Mike Davis", position: "Registered Nurse", department_id: 2, contact_info: "mikedavis@hospital.com, 555-9999" },
    { staff_id: 5, name: "Tech Lisa Wilson", position: "Radiology Technician", department_id: 4, contact_info: "lisawilson@hospital.com, 555-0000" },
    { staff_id: 6, name: "Admin Tom Taylor", position: "Billing Specialist", department_id: null, contact_info: "tomtaylor@hospital.com, 555-1212" }
  ];