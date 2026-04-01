output "flask_service_name" {
  value = render_web_service.flask_app.name
}

output "flask_service_url" {
  value = render_web_service.flask_app.url
}

output "adminer_service_name" {
  value = render_web_service.adminer.name
}

output "adminer_service_url" {
  value = render_web_service.adminer.url
}

