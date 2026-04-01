variable "render_api_key" {
  type      = string
  sensitive = true
}

variable "render_owner_id" {
  type = string
}

variable "image_url" {
  type = string
}

variable "image_tag" {
  type = string
}

variable "database_url" {
  description = "Internal Database URL fournie par Render PostgreSQL"
  type        = string
  sensitive   = true
}

variable "pg_host" {
  description = "Hostname PostgreSQL (pour Adminer)"
  type        = string
}

