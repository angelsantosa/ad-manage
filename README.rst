ad-manage
==============================

Ad manager

Creación de ambiente
------------

mkvirtualenv --python=/home/echarli/.pyenv/versions/2.7.11/bin/python2.7 ad_manage_env
 
Cargar el ambiente:
------------

source ~/.virtualenvs/ad_manage_env /bin/activate
 
Compilar CSS (se utiliza SASS  de Ruby)
------------

sass --watch ad-manage/static/sass/echarli.scss:ad-manage/static/css/base_style.css
 
Iniciar el servicio:
------------

./manage.py runserver 127.0.0.1:8002
 
iniciar el servicio con SSL
------------

./manage.py runserver_plus --cert /home/echarli/certs_selfsigned/ 127.0.0.1:8001






