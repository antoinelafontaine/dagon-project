server {
  listen 80;
  server_name {{ project_name }}.dev;
  {% if project_group %}
    root {{ project_local_base_path | expanduser }}/{{ project_group }}/{{ project_name }}/{{ project_root }};
  {% else %}
    root {{ project_local_base_path | expanduser }}/{{ project_name }}/{{ project_root }};
  {% endif %}
  access_log /usr/local/etc/nginx/logs/partnerplan.access.log main;

  client_max_body_size 50M;

  error_page 500 502 503 504 /50x.html;

  location = /favicon.ico {
    log_not_found off;
    access_log off;
  }

  location = /robots.txt {
    allow all;
    log_not_found off;
    access_log off;
  }

  location ~* \.(txt|log)$ {
    allow 192.168.0.0/16;
    deny all;
  }

  location ~ \..*/.*\.php$ {
    return 403;
  }

  location ~ \.php$ {
    fastcgi_read_timeout 1000;
    fastcgi_split_path_info ^(.+\.php)(/.+)$;
    try_files $uri =404; #NOTE: You should have "cgi.fix_pathinfo = 0;" in php.ini
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $request_filename;
    fastcgi_intercept_errors on;
    fastcgi_pass unix:/usr/local/etc/php/sockets/{{ project_php_version }};
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires max;
    log_not_found off;
  }

}
