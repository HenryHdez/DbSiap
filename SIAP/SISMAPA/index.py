# !/usr/bin/env python 
# -*- coding: utf-8 -*-
"""----Definición de las librerías requeridas para la ejecución de la aplicación---"""
import pymssql 
import requests
import threading
from flask import Flask, request, render_template 
import pandas as pd 
import json
from time import sleep                                           #Suspensión temporal
from requests.auth import AuthBase
from datetime import datetime
from dateutil.tz import tzlocal
from shapely import wkt
from Crypto.Hash import HMAC #Instalar pycryptodome==3.16.0
from Crypto.Hash import SHA256
from requests.auth import AuthBase
#python-dateutil==2.7.2
#pycrypto==2.6.1
#requests==2.18.4

app = Flask(__name__)

# Class to perform HMAC encoding
class AuthHmacMetosGet(AuthBase):
    # Creates HMAC authorization header for Metos REST service GET request.
    def __init__(self, apiRoute, publicKey, privateKey):
        self._publicKey = publicKey
        self._privateKey = privateKey
        self._method = 'GET'
        self._apiRoute = apiRoute

    def __call__(self, request):
        dateStamp = datetime.utcnow().strftime('%a, %d %b %Y %H:%M:%S GMT')
        request.headers['Date'] = dateStamp
        msg = (self._method + self._apiRoute + dateStamp + self._publicKey).encode(encoding='utf-8')
        h = HMAC.new(self._privateKey.encode(encoding='utf-8'), msg, SHA256)
        signature = h.hexdigest()
        request.headers['Authorization'] = 'hmac ' + self._publicKey + ':' + signature
        return request

def Crear_Tabla(etiquetas, estacion):
    Texto=""
    for i in range(len(etiquetas)):
        if i==0:
            Texto="CREATE TABLE dbo.SITB_Estacion_"+str(estacion)+" (Est"+str(estacion)+"_Id INT IDENTITY(1,1) PRIMARY KEY NOT NULL, "
        elif(i==1):    
            Texto=Texto+"Est_Id VARCHAR(50), "+etiquetas[i]+"  VARCHAR(50), "
        elif(i==len(etiquetas)-1):
            Texto=Texto+etiquetas[i]+" NUMERIC(10,2));"
        else:
            Texto=Texto+etiquetas[i]+" NUMERIC(10,2), "
    operardb(0, Texto, 0 ,"Crear")
    
def Consultar_Estacion(Ser_e,Fecha_unix_1,Fecha_unix_2):
    apiURI = 'https://api.fieldclimate.com/v1'
    # Autenticación o HMAC
    publicKey = '302ead2262739c6e79253adf70ca808da9d956488f380b67'
    privateKey = '6fc194ada406785b9e58b8c23b8a0d60da4f23ec373dfe20'
    # Definición del servicio
    apiRoute = '/data/normal/'+Ser_e+'/hourly/from/'+Fecha_unix_1+'/to/'+Fecha_unix_2
    auth = AuthHmacMetosGet(apiRoute, publicKey, privateKey)
    response = requests.get(apiURI+apiRoute, headers={'Accept': 'application/json'}, auth=auth)
    try:
        json_temp=response.json()
        return json_temp
    except:
        return []
    
def Consultar_API(accion, estacion):
    #002056BF Inicio 2019-01-10 12:00:00 Finca Casateja Facatativá 1547121600 hasta 2020 12 10 12 0 0 1607601600 2021 9 8 12 00 00 1631102400
    #00206878 Inicio 2018-08-24 07:00:00 C.I. Tibaitatá 1535112000
    #31017600 al año
    #Consultar sensor
    Sensor=operardb(0, "dbo.SITB_SenEst"+str(estacion), 0 ,"Consulta")
    llaves=list(Sensor['Sen'+str(estacion)+'_Columnas'].values)
    llaves.insert(0,'Est_Id')
    llaves.insert(1,'Est'+str(estacion)+'_Fecha')
    nombres_sens=list(Sensor['Sen'+str(estacion)+'_Direccion'].values)
    nombres_sens.insert(0,'date') 
    tam_lista=0
    
    try:
        tabla=operardb(0, "dbo.SITB_Estacion_"+str(estacion), 0 ,"Consulta")
        Ser_e="002056BF"
        if(estacion==1):
            Ser_e="002056BF"
        elif(estacion==2):
            Ser_e="00206878"
        elif(estacion==3):
            Ser_e="0020687D"
    
        if(len(tabla)!=0):
            TT=tabla['Est'+str(estacion)+'_Fecha'].values
            Ultima_Fecha = datetime.strptime(TT[len(TT)-1], '%Y-%m-%d %H:%M:%S')
            Ultima_Fecha = Ultima_Fecha.timestamp()+3600                
        else:
            Ultima_Fecha = 1514808000
        hoy=datetime.now()
        Fecha_actual = hoy.strftime("%Y-%m-%d %H:%M:00")
        Fecha_actual = datetime.strptime(Fecha_actual, '%Y-%m-%d %H:%M:%S')
        Fecha_actual = int(Fecha_actual.timestamp())
        
        print(datetime.fromtimestamp(Fecha_actual))
        print(datetime.fromtimestamp(Ultima_Fecha))
        
        json_est=Consultar_Estacion(Ser_e,str(Ultima_Fecha),str(Fecha_actual))
        try:
            datos=json_est['data']
            extra=json_est['extra']['model']
        except:
            datos=[]
            extra=[]
        diferencia=Fecha_actual-Ultima_Fecha
        print(diferencia)
        tam_lista=len(datos)
        
        while(tam_lista>8000):
            print("Mayores")
            print(Fecha_actual)
            Fecha_actual=Fecha_actual-int(diferencia/10)
            json_est=Consultar_Estacion(Ser_e,str(Ultima_Fecha),str(Fecha_actual))
            try:
                datos=json_est['data']
                extra=json_est['extra']['model']
            except:
                datos=[]
                extra=[]
            tam_lista=len(datos)
         
        diferencia=Fecha_actual-Ultima_Fecha  
        while(31536000<=diferencia and tam_lista<100):
            #Ultima_Fecha=Ultima_Fecha+int(diferencia/4)
            #diferencia=Fecha_actual-Ultima_Fecha
            print("Menores")
            print(Fecha_actual)
            Fecha_actual=Fecha_actual-int(diferencia/4)
            diferencia=Fecha_actual-Ultima_Fecha
            json_est=Consultar_Estacion(Ser_e,str(Ultima_Fecha),str(Fecha_actual))
            try:
                datos=json_est['data']
                extra=json_est['extra']['model']
            except:
                datos=[]
                extra=[]
            tam_lista=len(datos) 
        print(tam_lista)
    except:
        print("Creando tabla")
    
    if(accion==0):
        Crear_Tabla(llaves, estacion)     
        
    elif(accion==1 and 2<int(tam_lista)):  
        #Crear vector de inicio
        aux=['Est_Id', 'Est'+str(estacion)+'_Fecha']
        dfg=pd.DataFrame(columns=llaves)
        for i in range(1,len(nombres_sens)):
            aux.append(0) 
        mem=aux
        for i in datos:
            aux=None
            aux=mem
            for ind, j in enumerate(nombres_sens):
                aux[0]=Ser_e
                try:
                    temp=i[j]
                except:
                    temp=0
                if(temp!=None):
                    aux[ind+1]=temp
                else:
                    aux[ind+1]=0
            for w in extra:
                if(w['date']==aux[1]):
                    if(estacion==1):
                        aux[39]=w['ETo[mm]']
                    else:
                        aux[35]=w['ETo[mm]']
                    break
            dfg.loc[len(dfg)]=aux
        operardb(dfg, "dbo.SITB_Estacion_"+str(estacion), 0 ,"Actualizar")  
        
def Actualizar_pag():
    #0 Crear Estacion
    #1 Actualizar Estacion
    conta=1
    while True:
        print("Estacion "+str(conta))
        try:
            Consultar_API(0, conta)
        except:
            print("Tabla existente")
        try:
            Consultar_API(1, conta)
            df1=operardb(0, "dbo.SITB_Estacion_"+str(conta), 0 ,"Consulta")
            Arch1 = "Estacion"+str(conta)+" = '["+df1.to_json()+"]'"
            f = open ('Estacion1.json','w')
            f.write(Arch1)
            f.close()
            print("Finalizado")           
        except:
            print("No hay registros que actualizar")           
        conta=conta+1
        if(conta==4):
            conta=1
        sleep(500)

def operardb(df, tabla, geom ,accion):
    cnxn = pymssql.connect(#host='COMOSDSQL08\MSSQL2016DEX',
                           host='172.16.11.44\MSSQL2016DEX',
                           database='SEMapa',
                           user='WebSeMapa',
                           password='rdTGWjLYWIH6e0PKeXYl') 

    if(accion=="Actualizar"):
        cursor = cnxn.cursor()
        cols = ", ".join([str(i) for i in df.columns.tolist()])
        for i,row in df.iterrows():
            sql = "INSERT INTO "+tabla+" (" +cols + ") VALUES (" + "%s,"*(len(row)-1) + "%s)"
            try:
                cursor.execute(sql, tuple(row))
                cnxn.commit()
                print("Actualizado "+str(i))
            except:
                print("No actualizado" + str(tuple(row)))
        return[]
    
    elif(accion=="Consulta"):
        df1=pd.read_sql('SELECT * FROM '+tabla+';',cnxn)
        return df1

    elif(accion=="Crear"):
        try:
            cursor = cnxn.cursor()
            cursor.execute(tabla)
            cnxn.commit()
        except:
            print("Error al crear la tabla")
        return 0
    
    cnxn.close()

#Directorio raíz (página principal)
@app.route('/Estacion1')
def index1():
    return render_template('Estacion1.json')

@app.route('/Estacion2')
def index2():
    return render_template('Estacion2.json')

@app.route('/Estacion3')
def index3():
    return render_template('Estacion3.json')

def correr_pag():
    app.run(host='0.0.0.0', port='8000')

def jsonaaa():
    df1=operardb(0, "dbo.SITB_Estacion_1", 0 ,"Consulta")
    Arch1 = "Estacion1 = '["+df1.to_json()+"]'"
    f = open ('Estacion1.json','w')
    f.write(Arch1)
    f.close()
    df2=operardb(0, "dbo.SITB_Estacion_2", 0 ,"Consulta")
    Arch2 = "Estacion2 = '["+df2.to_json()+"]'"
    f = open ('Estacion2.json','w')
    f.write(Arch2)
    f.close()
    df3=operardb(0, "dbo.SITB_Estacion_3", 0 ,"Consulta")
    Arch3 = "Estacion3 = '["+df3.to_json()+"]'"
    f = open ('Estacion3.json','w')
    f.write(Arch3)
    f.close() 

#Función principal    
if __name__ == '__main__':
    correr_pag()
#    hilo2 = threading.Thread(target=Actualizar_pag)
#    hilo2.start() 


