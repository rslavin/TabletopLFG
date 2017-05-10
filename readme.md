# TabletopLFG
A looking for group tool for tabletop games.

### Developer notes
Before seeding data, run the following commands:

`php artisan jwt:generate`

Update Apache config file for site to have the following:

`RewriteEngine On
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule .* - [e=HTTP_AUTHORIZATION:%1]`
