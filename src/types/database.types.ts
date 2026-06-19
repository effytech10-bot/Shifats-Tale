export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          auth_user_id: string | null
          role: "STUDENT" | "TEACHER"
          full_name: string
          email: string
          phone: string | null
          avatar_url: string | null
          account_status: "ACTIVE" | "DISABLED" | "ARCHIVED"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          role?: "STUDENT" | "TEACHER"
          full_name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          account_status?: "ACTIVE" | "DISABLED" | "ARCHIVED"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          role?: "STUDENT" | "TEACHER"
          full_name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          account_status?: "ACTIVE" | "DISABLED" | "ARCHIVED"
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_auth_user_id_fkey"
            columns: ["auth_user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedSchema: "auth"
          }
        ]
      }
      student_profiles: {
        Row: {
          id: string
          profile_id: string
          student_code: string
          academic_level: string
          institution: string
          guardian_name: string
          guardian_phone: string
          address: string
          date_of_birth: string | null
          registration_status: "PENDING" | "APPROVED" | "REJECTED"
          teacher_note: string | null
          registered_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          student_code: string
          academic_level: string
          institution: string
          guardian_name: string
          guardian_phone: string
          address: string
          date_of_birth?: string | null
          registration_status?: "PENDING" | "APPROVED" | "REJECTED"
          teacher_note?: string | null
          registered_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          student_code?: string
          academic_level?: string
          institution?: string
          guardian_name?: string
          guardian_phone?: string
          address?: string
          date_of_birth?: string | null
          registration_status?: "PENDING" | "APPROVED" | "REJECTED"
          teacher_note?: string | null
          registered_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedSchema: "public"
          }
        ]
      }
      batches: {
        Row: {
          id: string
          name: string
          code: string
          slug: string
          subject: string
          academic_level: string
          description: string | null
          start_date: string
          end_date: string | null
          schedule: Json | null
          monthly_fee: number
          admission_fee: number
          capacity: number | null
          status: "DRAFT" | "OPEN" | "RUNNING" | "COMPLETED" | "ARCHIVED" | "CANCELLED"
          admission_open: boolean
          cover_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          slug: string
          subject: string
          academic_level: string
          description?: string | null
          start_date: string
          end_date?: string | null
          schedule?: Json | null
          monthly_fee: number
          admission_fee?: number
          capacity?: number | null
          status?: "DRAFT" | "OPEN" | "RUNNING" | "COMPLETED" | "ARCHIVED" | "CANCELLED"
          admission_open?: boolean
          cover_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          slug?: string
          subject?: string
          academic_level?: string
          description?: string | null
          start_date?: string
          end_date?: string | null
          schedule?: Json | null
          monthly_fee?: number
          admission_fee?: number
          capacity?: number | null
          status?: "DRAFT" | "OPEN" | "RUNNING" | "COMPLETED" | "ARCHIVED" | "CANCELLED"
          admission_open?: boolean
          cover_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          batch_id: string
          status: "PENDING" | "ACTIVE" | "DISABLED" | "COMPLETED" | "REJECTED" | "CANCELLED"
          approved_at: string | null
          disabled_at: string | null
          disable_reason: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          batch_id: string
          status?: "PENDING" | "ACTIVE" | "DISABLED" | "COMPLETED" | "REJECTED" | "CANCELLED"
          approved_at?: string | null
          disabled_at?: string | null
          disable_reason?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          batch_id?: string
          status?: "PENDING" | "ACTIVE" | "DISABLED" | "COMPLETED" | "REJECTED" | "CANCELLED"
          approved_at?: string | null
          disabled_at?: string | null
          disable_reason?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedSchema: "public"
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedSchema: "public"
          }
        ]
      }
      payments: {
        Row: {
          id: string
          student_id: string
          enrollment_id: string
          batch_id: string
          billing_month: number
          billing_year: number
          expected_amount: number
          paid_amount: number
          status: "UNPAID" | "PAID" | "PARTIALLY_PAID" | "WAIVED" | "REFUNDED" | "CANCELLED"
          payment_method: string | null
          payment_date: string | null
          reference_number: string | null
          confirmed_at: string | null
          teacher_note: string | null
          student_note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          enrollment_id: string
          batch_id: string
          billing_month: number
          billing_year: number
          expected_amount: number
          paid_amount?: number
          status?: "UNPAID" | "PAID" | "PARTIALLY_PAID" | "WAIVED" | "REFUNDED" | "CANCELLED"
          payment_method?: string | null
          payment_date?: string | null
          reference_number?: string | null
          confirmed_at?: string | null
          teacher_note?: string | null
          student_note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          enrollment_id?: string
          batch_id?: string
          billing_month?: number
          billing_year?: number
          expected_amount?: number
          paid_amount?: number
          status?: "UNPAID" | "PAID" | "PARTIALLY_PAID" | "WAIVED" | "REFUNDED" | "CANCELLED"
          payment_method?: string | null
          payment_date?: string | null
          reference_number?: string | null
          confirmed_at?: string | null
          teacher_note?: string | null
          student_note?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedSchema: "public"
          },
          {
            foreignKeyName: "payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedSchema: "public"
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedSchema: "public"
          }
        ]
      }
      batch_contents: {
        Row: {
          id: string
          batch_id: string
          title: string
          description: string | null
          content_type: "PDF" | "DOC" | "DOCX" | "IMAGE" | "LINK" | "YOUTUBE" | "NOTE" | "ANNOUNCEMENT"
          storage_path: string | null
          external_url: string | null
          mime_type: string | null
          file_size: number | null
          status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
          release_at: string | null
          expires_at: string | null
          allow_download: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          batch_id: string
          title: string
          description?: string | null
          content_type: "PDF" | "DOC" | "DOCX" | "IMAGE" | "LINK" | "YOUTUBE" | "NOTE" | "ANNOUNCEMENT"
          storage_path?: string | null
          external_url?: string | null
          mime_type?: string | null
          file_size?: number | null
          status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"
          release_at?: string | null
          expires_at?: string | null
          allow_download?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          batch_id?: string
          title?: string
          description?: string | null
          content_type?: "PDF" | "DOC" | "DOCX" | "IMAGE" | "LINK" | "YOUTUBE" | "NOTE" | "ANNOUNCEMENT"
          storage_path?: string | null
          external_url?: string | null
          mime_type?: string | null
          file_size?: number | null
          status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"
          release_at?: string | null
          expires_at?: string | null
          allow_download?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_contents_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedSchema: "public"
          }
        ]
      }
      exams: {
        Row: {
          id: string
          batch_id: string
          name: string
          description: string | null
          exam_type: "CLASS_TEST" | "WEEKLY_EXAM" | "MONTHLY_EXAM" | "MODEL_TEST" | "ASSIGNMENT" | "FINAL_EXAM"
          exam_date: string
          total_marks: number
          pass_marks: number
          status: "DRAFT" | "SCHEDULED" | "COMPLETED" | "RESULT_DRAFT" | "RESULT_PUBLISHED" | "ARCHIVED"
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          batch_id: string
          name: string
          description?: string | null
          exam_type: "CLASS_TEST" | "WEEKLY_EXAM" | "MONTHLY_EXAM" | "MODEL_TEST" | "ASSIGNMENT" | "FINAL_EXAM"
          exam_date: string
          total_marks: number
          pass_marks: number
          status?: "DRAFT" | "SCHEDULED" | "COMPLETED" | "RESULT_DRAFT" | "RESULT_PUBLISHED" | "ARCHIVED"
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          batch_id?: string
          name?: string
          description?: string | null
          exam_type?: "CLASS_TEST" | "WEEKLY_EXAM" | "MONTHLY_EXAM" | "MODEL_TEST" | "ASSIGNMENT" | "FINAL_EXAM"
          exam_date?: string
          total_marks?: number
          pass_marks?: number
          status?: "DRAFT" | "SCHEDULED" | "COMPLETED" | "RESULT_DRAFT" | "RESULT_PUBLISHED" | "ARCHIVED"
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exams_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedSchema: "public"
          }
        ]
      }
      exam_results: {
        Row: {
          id: string
          exam_id: string
          student_id: string
          enrollment_id: string
          obtained_marks: number | null
          attendance_status: "PRESENT" | "ABSENT"
          grade: string | null
          remarks: string | null
          rank: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          student_id: string
          enrollment_id: string
          obtained_marks?: number | null
          attendance_status?: "PRESENT" | "ABSENT"
          grade?: string | null
          remarks?: string | null
          rank?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          student_id?: string
          enrollment_id?: string
          obtained_marks?: number | null
          attendance_status?: "PRESENT" | "ABSENT"
          grade?: string | null
          remarks?: string | null
          rank?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_results_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedSchema: "public"
          },
          {
            foreignKeyName: "exam_results_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedSchema: "public"
          },
          {
            foreignKeyName: "exam_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedSchema: "public"
          }
        ]
      }
      announcements: {
        Row: {
          id: string
          batch_id: string
          title: string
          message: string
          status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          batch_id: string
          title: string
          message: string
          status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          batch_id?: string
          title?: string
          message?: string
          status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedSchema: "public"
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          related_entity_type: string | null
          related_entity_id: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          related_entity_type?: string | null
          related_entity_id?: string | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          related_entity_type?: string | null
          related_entity_id?: string | null
          read_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedSchema: "public"
          }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          actor_user_id: string | null
          action: string
          entity_type: string
          entity_id: string
          old_value: Json | null
          new_value: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_user_id?: string | null
          action: string
          entity_type: string
          entity_id: string
          old_value?: Json | null
          new_value?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          actor_user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string
          old_value?: Json | null
          new_value?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedSchema: "public"
          }
        ]
      }
    }
    Views: {
      [_ in any]: never
    }
    Functions: {
      current_profile_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_active_teacher: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_student_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_active_enrollment: {
        Args: {
          batch_uuid: string
        }
        Returns: boolean
      }
      student_has_any_active_enrollment: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_student_teacher_note: {
        Args: {
          student_uuid: string
        }
        Returns: string | null
      }
      get_payment_teacher_note: {
        Args: {
          payment_uuid: string
        }
        Returns: string | null
      }
      setup_teacher_account: {
        Args: {
          email_to_promote: string
        }
        Returns: void
      }
    }
    Enums: {
      user_role: "STUDENT" | "TEACHER"
      account_status: "ACTIVE" | "DISABLED" | "ARCHIVED"
      registration_status: "PENDING" | "APPROVED" | "REJECTED"
      batch_status: "DRAFT" | "OPEN" | "RUNNING" | "COMPLETED" | "ARCHIVED" | "CANCELLED"
      enrollment_status: "PENDING" | "ACTIVE" | "DISABLED" | "COMPLETED" | "REJECTED" | "CANCELLED"
      payment_status: "UNPAID" | "PAID" | "PARTIALLY_PAID" | "WAIVED" | "REFUNDED" | "CANCELLED"
      content_type: "PDF" | "DOC" | "DOCX" | "IMAGE" | "LINK" | "YOUTUBE" | "NOTE" | "ANNOUNCEMENT"
      content_status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      exam_type: "CLASS_TEST" | "WEEKLY_EXAM" | "MONTHLY_EXAM" | "MODEL_TEST" | "ASSIGNMENT" | "FINAL_EXAM"
      exam_status: "DRAFT" | "SCHEDULED" | "COMPLETED" | "RESULT_DRAFT" | "RESULT_PUBLISHED" | "ARCHIVED"
      attendance_status: "PRESENT" | "ABSENT"
    }
    CompositeTypes: {
      [_ in any]: never
    }
  }
}
