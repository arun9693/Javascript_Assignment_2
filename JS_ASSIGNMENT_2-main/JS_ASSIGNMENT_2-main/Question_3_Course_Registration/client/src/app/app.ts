import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  credits: number;
  department: string;
  totalSlots: number;
  availableSlots: number;
  schedule: string;
  description: string;
}

export interface Registration {
  _id: string;
  studentName: string;
  studentRollNo: string;
  studentEmail: string;
  studentDept: string;
  studentSemester: string;
  courseCode: string;
  courseName: string;
  registeredAt: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  apiUrl = 'http://localhost:5002/api';

  courses: Course[] = [];
  studentRegistrations: Registration[] = [];
  selectedCourse: Course | null = null;

  lookupRollNo: string = '';
  activeTab: 'courses' | 'my-courses' = 'courses';

  registrationForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  storageInfo = 'MongoDB';

  departments = [
    'Computer Science and Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics and Communication',
    'Mechanical Engineering',
  ];

  semesters = ['III', 'IV', 'V', 'VI', 'VII', 'VIII'];

  ngOnInit() {
    this.initForm();
    this.loadCourses();
  }

  initForm() {
    this.registrationForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(3)]],
      studentRollNo: ['', [Validators.required, Validators.pattern(/^[0-9]{2}[A-Za-z]{2,4}[0-9]{3}$/)]],
      studentEmail: ['', [Validators.required, Validators.email]],
      studentDept: ['Computer Science and Engineering', Validators.required],
      studentSemester: ['V', Validators.required],
      courseCode: ['', Validators.required],
    });
  }

  // Convenience getter for easy access to form fields in template
  get f() {
    return this.registrationForm.controls;
  }

  loadCourses() {
    this.loading = true;
    this.http.get<{ success: boolean; data: Course[]; storage?: string }>(`${this.apiUrl}/courses`).subscribe({
      next: (res) => {
        if (res.success) {
          this.courses = res.data;
          if (res.storage) this.storageInfo = res.storage;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Course load error:', err);
        this.showToast('Backend server on port 5002 not reachable. Please start server.', true);
        this.loading = false;
      },
    });
  }

  selectCourseForRegistration(course: Course) {
    this.selectedCourse = course;
    this.registrationForm.patchValue({
      courseCode: course.courseCode,
    });
    this.activeTab = 'courses';
    window.scrollTo({ top: 350, behavior: 'smooth' });
  }

  onSubmitRegistration() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registrationForm.invalid) {
      return;
    }

    this.loading = true;
    const payload = this.registrationForm.value;

    this.http.post<{ success: boolean; message: string; data: Registration }>(`${this.apiUrl}/register`, payload).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.showToast(res.message || 'Course registration successful!');
          this.lookupRollNo = payload.studentRollNo;
          this.loadStudentRegistrations(payload.studentRollNo);
          this.loadCourses();
          this.resetForm();
        } else {
          this.showToast(res.message, true);
        }
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Registration failed. Check inputs or connection.';
        this.showToast(msg, true);
      },
    });
  }

  cancelRegistration(reg: Registration) {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel your registration for course ${reg.courseCode} (${reg.courseName})?`
    );
    if (!confirmCancel) return;

    this.loading = true;
    this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/cancel`, {
      studentRollNo: reg.studentRollNo,
      courseCode: reg.courseCode,
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.showToast(res.message || 'Registration cancelled successfully!');
          this.loadStudentRegistrations(reg.studentRollNo);
          this.loadCourses();
        } else {
          this.showToast(res.message, true);
        }
      },
      error: (err) => {
        this.loading = false;
        this.showToast(err.error?.message || 'Error cancelling registration', true);
      },
    });
  }

  searchRegistrationsByRollNo() {
    if (!this.lookupRollNo.trim()) {
      this.showToast('Please enter a roll number to search', true);
      return;
    }
    this.loadStudentRegistrations(this.lookupRollNo.trim());
  }

  loadStudentRegistrations(rollNo: string) {
    this.loading = true;
    this.http.get<{ success: boolean; data: Registration[] }>(`${this.apiUrl}/registrations/${rollNo}`).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.studentRegistrations = res.data;
          this.activeTab = 'my-courses';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Fetch registration error:', err);
      },
    });
  }

  resetForm() {
    this.submitted = false;
    this.selectedCourse = null;
    this.registrationForm.reset({
      studentName: '',
      studentRollNo: '',
      studentEmail: '',
      studentDept: 'Computer Science and Engineering',
      studentSemester: 'V',
      courseCode: '',
    });
  }

  showToast(msg: string, isError = false) {
    if (isError) {
      this.errorMessage = msg;
      setTimeout(() => (this.errorMessage = ''), 4000);
    } else {
      this.successMessage = msg;
      setTimeout(() => (this.successMessage = ''), 4000);
    }
  }
}
