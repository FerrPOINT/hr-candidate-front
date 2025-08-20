#!/bin/bash

# HR Recruiter Front Deployment Script
# Version: 4.0 (Sprint 4)
# Usage: ./scripts/deploy.sh [domain] [api-host]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=${1:-"your-domain.com"}
API_HOST=${2:-"your-api-host:8080"}
PROJECT_NAME="hr-recruiter-front"
WEB_ROOT="/var/www/$PROJECT_NAME"
NGINX_SITE="/etc/nginx/sites-available/$PROJECT_NAME"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    # Check if nginx is installed
    if ! command -v nginx &> /dev/null; then
        log_error "Nginx is not installed. Please install nginx first."
        exit 1
    fi
    
    # Check if certbot is installed (optional)
    if ! command -v certbot &> /dev/null; then
        log_warning "Certbot is not installed. SSL certificates will need to be configured manually."
    fi
    
    log_success "Dependencies check completed"
}

create_directories() {
    log_info "Creating directories..."
    
    mkdir -p "$WEB_ROOT"
    mkdir -p "$WEB_ROOT/build"
    mkdir -p /var/log/nginx
    
    log_success "Directories created"
}

copy_files() {
    log_info "Copying application files..."
    
    # Copy build files
    if [ -d "build" ]; then
        cp -r build/* "$WEB_ROOT/build/"
        log_success "Build files copied"
    else
        log_error "Build directory not found. Please run 'npm run build' first."
        exit 1
    fi
    
    # Copy nginx configuration
    if [ -f "nginx/production.conf" ]; then
        cp nginx/production.conf "$NGINX_SITE"
        log_success "Nginx configuration copied"
    else
        log_error "Nginx configuration not found at nginx/production.conf"
        exit 1
    fi
}

configure_nginx() {
    log_info "Configuring Nginx..."
    
    # Replace placeholders in nginx config
    sed -i "s/your-domain.com/$DOMAIN/g" "$NGINX_SITE"
    sed -i "s/your-api-host:8080/$API_HOST/g" "$NGINX_SITE"
    
    # Create symbolic link
    if [ ! -L "/etc/nginx/sites-enabled/$PROJECT_NAME" ]; then
        ln -s "$NGINX_SITE" "/etc/nginx/sites-enabled/$PROJECT_NAME"
    fi
    
    # Test nginx configuration
    if nginx -t; then
        log_success "Nginx configuration is valid"
    else
        log_error "Nginx configuration test failed"
        exit 1
    fi
}

set_permissions() {
    log_info "Setting file permissions..."
    
    chown -R www-data:www-data "$WEB_ROOT"
    chmod -R 755 "$WEB_ROOT"
    
    # Set specific permissions for nginx config
    chmod 644 "$NGINX_SITE"
    
    log_success "Permissions set"
}

setup_ssl() {
    log_info "Setting up SSL certificate..."
    
    if command -v certbot &> /dev/null; then
        # Check if certificate already exists
        if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
            log_success "SSL certificate already exists"
        else
            log_warning "SSL certificate not found. Please run:"
            echo "  certbot --nginx -d $DOMAIN -d www.$DOMAIN"
        fi
    else
        log_warning "Certbot not installed. Please install and configure SSL manually."
    fi
}

restart_services() {
    log_info "Restarting services..."
    
    # Reload nginx
    systemctl reload nginx
    
    # Check nginx status
    if systemctl is-active --quiet nginx; then
        log_success "Nginx is running"
    else
        log_error "Nginx failed to start"
        systemctl status nginx
        exit 1
    fi
}

create_environment_file() {
    log_info "Creating environment configuration..."
    
    cat > "$WEB_ROOT/.env" << EOF
# HR Recruiter Front Environment Configuration
# Generated on $(date)

# API Configuration
REACT_APP_API_BASE_URL=https://$API_HOST
REACT_APP_ELEVENLABS_API_KEY=your-elevenlabs-key

# Environment
NODE_ENV=production

# Domain
REACT_APP_DOMAIN=$DOMAIN
EOF
    
    log_success "Environment file created at $WEB_ROOT/.env"
}

test_deployment() {
    log_info "Testing deployment..."
    
    # Test HTTP redirect
    if curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN" | grep -q "301\|302"; then
        log_success "HTTP to HTTPS redirect working"
    else
        log_warning "HTTP redirect test failed (this is normal if SSL is not configured yet)"
    fi
    
    # Test if files are accessible
    if [ -f "$WEB_ROOT/build/index.html" ]; then
        log_success "Application files are in place"
    else
        log_error "Application files not found"
        exit 1
    fi
}

show_next_steps() {
    echo
    log_success "Deployment completed successfully!"
    echo
    echo "Next steps:"
    echo "1. Configure SSL certificate:"
    echo "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    echo
    echo "2. Update environment variables in:"
    echo "   $WEB_ROOT/.env"
    echo
    echo "3. Test the application:"
    echo "   https://$DOMAIN"
    echo
    echo "4. Monitor logs:"
    echo "   tail -f /var/log/nginx/$PROJECT_NAME.access.log"
    echo "   tail -f /var/log/nginx/$PROJECT_NAME.error.log"
    echo
    echo "5. Check nginx status:"
    echo "   systemctl status nginx"
    echo
}

# Main deployment process
main() {
    echo "🚀 HR Recruiter Front Deployment Script"
    echo "Domain: $DOMAIN"
    echo "API Host: $API_HOST"
    echo "Project: $PROJECT_NAME"
    echo
    
    check_root
    check_dependencies
    create_directories
    copy_files
    configure_nginx
    set_permissions
    setup_ssl
    restart_services
    create_environment_file
    test_deployment
    show_next_steps
}

# Run main function
main "$@"

