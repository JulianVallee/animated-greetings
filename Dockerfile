FROM wordpress:latest
RUN a2enmod headers && echo 'Header set Access-Control-Allow-Origin "*"' >> /etc/apache2/conf-enabled/cors.conf
