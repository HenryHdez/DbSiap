#Sistema operativo
FROM ubuntu:18.04 as build
#Directorio de trabajo
WORKDIR /opt/app
#Copiar todos los archivos ..
COPY .. /opt/app/ 
# INSTALAR PIP
RUN apt update && apt install -y python3-pip
#INSTALACIÓN DE PAQUETES
RUN pip3 install --upgrade pip
RUN pip3 install --upgrade setuptools
RUN pip install -U pip
RUN apt update
RUN apt install -y libpq-dev gdal-bin libgdal-dev
#Puerto definido por el usuario
COPY requirements.txt /opt/app/requirements.txt
RUN pip3 install -r requirements.txt
EXPOSE 5000
#Ejecución del SCRIPT en el terminal
CMD ["python3", "index.py"]