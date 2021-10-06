# !/usr/bin/env python 
# -*- coding: utf-8 -*-
"""----Definición de las librerías requeridas para la ejecución de la aplicación---"""
##from flask_socketio import SocketIO
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd                                      #Gestión de archivos de texto
import os                                                #Hereda funciones del sistema operativo para su uso en PYTHON                    
import base64                                            #Codifica contenido en base64 para su almacenamiento en una WEB
import threading
import requests
import geopandas as gpd
import pymssql 
import contextily as ctx
from werkzeug.utils import secure_filename               #Encriptar información archivos
from flask import Flask, request, render_template        #Interfaz gráfica WEB
from time import sleep                                   #Suspensión temporal
from matplotlib.backends.backend_agg import FigureCanvasAgg
from requests.auth import AuthBase
from datetime import datetime
from dateutil.tz import tzlocal
from shapely import wkt
from Crypto.Hash import HMAC
from Crypto.Hash import SHA256
from requests.auth import AuthBase

#Generación de la interfaz WEB
app = Flask(__name__)
uploads_dir = os.path.join(app.instance_path, 'uploads')
try:
    os.makedirs(uploads_dir, True)
except OSError: 
    print('Directorio existente')
    
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    response.headers["Expires"] = '0'
    response.headers["Pragma"] = "no-cache"
    return response

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
            Texto="CREATE TABLE SITB_Estacion_"+str(estacion)+" (Est"+str(estacion)+"_Id INT IDENTITY(1,1) PRIMARY KEY NOT NULL, "
        elif(i==1):    
            Texto=Texto+"Est_Id VARCHAR(50), "+etiquetas[i]+"  VARCHAR(50), "
        elif(i==len(etiquetas)-1):
            Texto=Texto+etiquetas[i]+" NUMERIC(10,2));"
        else:
            Texto=Texto+etiquetas[i]+" NUMERIC(10,2), "
    operardb_geof(0, Texto, 0 ,"Crear")

def operardb_geof(df, tabla, geom ,accion):
    cnxn = pymssql.connect(host='172.16.11.44\MSSQL2016DSC', 
                           database='DbSiap', 
                           user='WebSiap', 
                           password='W4bS1ap') 
    
    if(accion=="Actualizar"):
        cursor = cnxn.cursor()
        cols = ", ".join([str(i) for i in df.columns.tolist()])
        for i,row in df.iterrows():
            sql = "INSERT INTO "+tabla+" (" +cols + ") VALUES (" + "%s,"*(len(row)-1) + "%s)"
            try:
                cursor.execute(sql, tuple(row))
                cnxn.commit()
                print("Actualizado")
            except:
                print("No actualizado" + str(tuple(row)))
        return[]
            
    elif(accion=="Consulta"):
        df1=pd.read_sql('SELECT '+geom+'.STAsText() as Lista FROM '+tabla+';',cnxn)
        df2=pd.read_sql('SELECT * FROM '+tabla+';',cnxn)
        df2[geom]=df1['Lista']
        return df2
    
    elif(accion=="Consulta2"):
        df1=pd.read_sql('SELECT * FROM '+tabla+';',cnxn)
        return df1
    
    elif(accion=="Consulta3"):
        df1=pd.read_sql('SELECT * FROM SYS.tables ORDER BY name;',cnxn)
        return df1

    elif(accion=="Borrar1"):
        cursor = cnxn.cursor()
        cursor.execute('DROP TABLE '+tabla+';')
        cnxn.commit()
        return 0

    elif(accion=="Borrar2"):
        cursor = cnxn.cursor()
        cursor.execute('DELETE FROM '+tabla+';')
        cnxn.commit()
        return 0

    elif(accion=="Crear"):
        try:
            cursor = cnxn.cursor()
            cursor.execute(tabla)
            cnxn.commit()
        except:
            print("Error al crear la bd")
        return 0
    
    cnxn.close()
            
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
        return json_temp['data']
    except:
        return []
    
def Consultar_API(accion, estacion):
    #002056BF Inicio 2019-01-10 12:00:00 Finca Casateja Facatativá 1547121600 hasta 2020 12 10 12 0 0 1607601600 2021 9 8 12 00 00 1631102400
    #00206878 Inicio 2018-08-24 07:00:00 C.I. Tibaitatá 1535112000
    #31017600 al año
    #Consultar sensor
    Sensor=operardb_geof(0, "SITB_SenEst"+str(estacion), 0 ,"Consulta2")
    llaves=list(Sensor['Sen'+str(estacion)+'_Columnas'].values)
    llaves.insert(0,'Est_Id')
    llaves.insert(1,'Est'+str(estacion)+'_Fecha')
    nombres_sens=list(Sensor['Sen'+str(estacion)+'_Direccion'].values)
    nombres_sens.insert(0,'date') 
    tam_lista=0
    
    try:
        tabla=operardb_geof(0, "SITB_Estacion_"+str(estacion), 0 ,"Consulta2")
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
        
        datos=Consultar_Estacion(Ser_e,str(Ultima_Fecha),str(Fecha_actual))
        diferencia=Fecha_actual-Ultima_Fecha
        tam_lista=len(datos)
        
        while(tam_lista>8000):
            Fecha_actual=Fecha_actual-int(diferencia/10)
            datos=Consultar_Estacion(Ser_e,str(Ultima_Fecha),str(Fecha_actual))  
            tam_lista=len(datos)
         
        diferencia=Fecha_actual-Ultima_Fecha  
        while(31536000<=diferencia and tam_lista<100):
            #Ultima_Fecha=Ultima_Fecha+int(diferencia/4)
            #diferencia=Fecha_actual-Ultima_Fecha
            Fecha_actual=Fecha_actual-int(diferencia/4)
            diferencia=Fecha_actual-Ultima_Fecha
            datos=Consultar_Estacion(Ser_e,str(Ultima_Fecha),str(Fecha_actual))  
            tam_lista=len(datos) 
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
            dfg.loc[len(dfg)]=aux
        operardb_geof(dfg, "SITB_Estacion_"+str(estacion), 0 ,"Actualizar")  
                          
def Actualizar_pag():
    #0 Crear Estacion
    #1 Actualizar Estacion
    conta=1
    while 1:
        sleep(7200)
        print("Estacion "+str(conta))
        try:
            Consultar_API(0, conta)
        except:
            print("Tabla existente")
        try:
            Consultar_API(1, conta)
        except:
            print("No hay registros que actualizar")           
        conta=conta+1
        if(conta==4):
            conta=1
            
def graficar_linea():
    global result2
    global listado_sensores
    
    DF_L=[]    
    Dicci=result2.to_dict()
    for i in range(1,4):
        DF_L.append(operardb_geof(0, "SITB_SenEst"+str(i), 0 ,"Consulta2"))

    Eti1=list(DF_L[0]['Sen1_Columnas'].values)
    Eti2=list(DF_L[1]['Sen2_Columnas'].values)
    Eti3=list(DF_L[2]['Sen3_Columnas'].values)
    unidades1=DF_L[0]['Uni_Simbolo'].values
    unidades2=DF_L[1]['Uni_Simbolo'].values
    unidades3=DF_L[2]['Uni_Simbolo'].values
           
    try:
        Fecha_1=Dicci['Fecha_1']+" "+Dicci['Horas_1']+":00"
        Fecha_2=Dicci['Fecha_2']+" "+Dicci['Horas_2']+":00"
        
        #Construcción del arreglo y filtrado
        AR=operardb_geof(0, "SITB_Estacion_"+str(Dicci['Estacion']), 0 ,"Consulta2")
        Texto="Est"+str(Dicci['Estacion'])+"_Fecha"
        AR[Texto] = AR[Texto].astype('datetime64[ns]')
        Filtro=Texto+" >= "+"'"+Fecha_1+"'"+" and "+Texto+" <= "+"'"+Fecha_2+"'"
        AR=AR.query(Filtro)
        
        #Construccion del vector de salida
        y_g=[]
        if(int(Dicci['Estacion'])<=1):
            y_g=AR[Dicci['Sensores1']].values
            pos=Eti1.index(Dicci['Sensores1'])
            graficar_png(y_g,"Fecha",unidades1[pos],Eti1[pos]+" (Estación: "+str(Dicci['Estacion'])+")", Dicci['Fecha_1'], Dicci['Fecha_2'])
        elif(int(Dicci['Estacion'])==2):
            y_g=AR[Dicci['Sensores2']].values
            pos=Eti2.index(Dicci['Sensores2'])
            graficar_png(y_g,"Fecha",unidades2[pos],Eti2[pos]+" (Estación: "+str(Dicci['Estacion'])+")", Dicci['Fecha_1'], Dicci['Fecha_2'])
        elif(int(Dicci['Estacion'])==3):
            y_g=AR[Dicci['Sensores3']].values
            pos=Eti3.index(Dicci['Sensores3'])
            graficar_png(y_g,"Fecha",unidades3[pos],Eti3[pos]+" (Estación: "+str(Dicci['Estacion'])+")", Dicci['Fecha_1'], Dicci['Fecha_2'])           
        return [Eti1, Eti2, Eti3]       
    except:
        return 0  

def graficar_png(y,x_label,y_label,titulo,f1,f2):
    try:
        os.remove('static/Grafico.png')
    except:
        #x=[]
        y=[]
    #x=np.array(x)
    y=np.array(y)
    Fig_1,a = plt.subplots(frameon=False)
    l1,=a.plot(y, linewidth=4)
    a.set_xticklabels([" ", f1, " ", " ", " ", f2],rotation=45)
    a.set_ylabel(y_label, fontsize=18)
    a.set_xlabel(x_label, fontsize=18)
    a.set_title(titulo, fontsize=20)
    plt.tight_layout()
    for item in [Fig_1,a]:
           item.patch.set_visible(False)
    FigureCanvasAgg(Fig_1).print_png('static/Grafico.png', bbox_inches = 'tight', pad_inches=0) 
    sleep(1)
    plt.close(Fig_1)
    del(Fig_1)
    
def Consultar_sensor(estacion):
    # Definición de la versión del API
    Ser_e="002056BF"
    if(estacion==1):
        Ser_e="002056BF"
    elif(estacion==2):
        Ser_e="00206878"
    elif(estacion==3):
        Ser_e="0020687D"  
        
    apiURI = 'https://api.fieldclimate.com/v1'
    # Autenticación o HMAC
    publicKey = '302ead2262739c6e79253adf70ca808da9d956488f380b67'
    privateKey = '6fc194ada406785b9e58b8c23b8a0d60da4f23ec373dfe20'
    # Definición del servicio
    apiRoute = '/station/'+Ser_e+'/sensors'
    auth = AuthHmacMetosGet(apiRoute, publicKey, privateKey)
    response = requests.get(apiURI+apiRoute, headers={'Accept': 'application/json'}, auth=auth)
    json_temp=response.json()
    
    Etiquetas=[]
    for ind,i in enumerate (json_temp):
        eti=(str(i['ch'])+'_'+
            str(i['serial'])+'_'+
            str(i['mac'])+'_'+
            str(i['code']))
        for j in i['aggr']:
            Faux="A"+str(ind)+"_"+i['name'].replace(" ","_")+"_"+j
            Faux=Faux.replace("(","_")
            Faux=Faux.replace(")","_")
            Etiquetas.append([i['name'], Faux, i['unit'], i['decimals'], eti+"_"+j])
            
    df=pd.DataFrame(Etiquetas, columns=["Sen"+str(estacion)+"_Nombre", "Sen"+str(estacion)+"_Columnas", "Uni_Simbolo", "Sen"+str(estacion)+"_Decimales", "Sen"+str(estacion)+"_Direccion"])
    #Consultar información previa
    df1=operardb_geof(0, "SITB_SenEst"+str(estacion), 0 ,"Consulta2")
    if(len(df1)<=len(df)):
        df1=df
    #Borrar
    operardb_geof(0, "SITB_SenEst"+str(estacion), 0 ,"Borrar")
    #Crear
    Texto=("CREATE TABLE SITB_SenEst"+str(estacion)+
           " (Sen"+str(estacion)+"_Nombre VARCHAR(50),"+ 
           " Sen"+str(estacion)+"_Columnas VARCHAR(50),"+
           " Uni_Simbolo VARCHAR(50),"+ 
           " Sen"+str(estacion)+"_Decimales VARCHAR(50),"+
           " Sen"+str(estacion)+"_Direccion VARCHAR(50));")     
    operardb_geof(0, Texto, 0 ,"Crear")
    #Actualizar sensores 
    operardb_geof(df, "SITB_SenEst"+str(estacion), 0 ,"Actualizar")

def Cargar_archivos_shp(Archivo, k, estado, usuario, Fecha):
    df = pd.DataFrame(Archivo)
    for i in range(len(df)):
        df['A']=estado
        df['B']=usuario
        df['C']=Fecha 
        df['D']=usuario
        df['E']=Fecha 
    if(k==0):
        df.columns=['Ae_Descripcion', 'Ae_Area', 'Ae_Perimetro', 'Ae_Geometria', 'Ae_Estado', 'Ae_UsuarioReg', 'Ae_FechaReg', 'Ae_UsuarioMod', 'Ae_FechaMod']
    elif(k==1):
        df.columns=['Est_Id', 'ArIn_Area', 'ArIn_Perimetro', 'ArIn_Geometria', 'ArIn_Estado', 'ArIn_UsuarioReg', 'ArIn_FechaReg', 'ArIn_UsuarioMod', 'ArIn_FechaMod']
    elif(k==2):
        df.columns=['Est_Id', 'Mun_Id', 'Est_MunId', 'Est_Latitud', 'Est_Longitud', 'Est_Elevacion', 'Est_FechaIns', 'Est_Propietario', 'Est_Geometria', 'Est_Estado', 'Est_UsuarioReg', 'Est_FechaReg', 'Est_UsuarioMod', 'Est_FechaMod']
    df=df.astype(str)
    if(k==0):
        operardb_geof(df, "SITB_AreaEstudio",'0',"Actualizar")
    elif(k==1):
        operardb_geof(df, "SITB_AreaInfluencia",'0', "Actualizar")    
    elif(k==2):
        operardb_geof(df, "SITB_Estacion",'0',"Actualizar")     

#Codificar los archivos en formato de texto plano
def Crear_archivo_base_64(ruta):
    with open(ruta, 'rb') as Archivo_codificado_1:
        Archivo_binario_1 = Archivo_codificado_1.read()
        Archivo_binario_64_1 = base64.b64encode(Archivo_binario_1)
        Mensaje_base_64_1 = Archivo_binario_64_1.decode('utf-8')
        return Mensaje_base_64_1
    
#De-codificar los archivos en formato de texto plano
def Leer_Ima_base64(Nombre, Texto_base64):
    Ima_Base64 = Texto_base64.encode('utf-8')
    with open(Nombre, 'wb') as Archivo_Normal:
        Archivo_deco = base64.decodebytes(Ima_Base64)
        Archivo_Normal.write(Archivo_deco)

def Sensores(est,ID):
    Consultar_sensor(est)            
    List_sen=operardb_geof(0, "Sen_Est_"+str(est), 0 ,"Consulta2")
    ett=[]
    for i,row in List_sen.iterrows():
        ett.append(row)
    return render_template('Admin_D.html', 
                           texto="Tabla de sensores actualizada desde la estación con ID="+ID,
                           Nom_col=List_sen.head(),
                           Etiquetas=ett,
                           Cant2=len(ett))

#Directorio raíz (página principal)
@app.route('/')
def index():
    return render_template('principal.html')

@app.route('/informe1', methods = ['POST','GET'])
def informe1():
    global result
    Dicci=result.to_dict()  
    try:
        Lista=[]
        Fecha_1=Dicci['Fecha_1']+" "+Dicci['Horas_1']+":00"
        Fecha_2=Dicci['Fecha_2']+" "+Dicci['Horas_2']+":00"
        #Construcción del arreglo y filtrado
        AR=operardb_geof(0, "SITB_Estacion_"+str(Dicci['Estacion']), 0 ,"Consulta2")
        Texto="Est"+str(Dicci['Estacion'])+"_Fecha"
        AR[Texto] = AR[Texto].astype('datetime64[ns]')
        Filtro=Texto+" >= "+"'"+Fecha_1+"'"+" and "+Texto+" <= "+"'"+Fecha_2+"'"
        AR=AR.query(Filtro)
        Filas = AR.to_numpy().tolist()
        #Exportar a excel
        AR.to_excel ('static/Reporte.xlsx')
        
        for i in Filas:
            Lista.append(i)
        NC=AR.columns.values
        
        return render_template('Informe1_1.html',
                               Nom_col=NC,
                               Etiquetas=Lista,
                               Cant=len(NC))
    except:
        return render_template('respuesta.html',
                               rta="No hay datos disponibles")        

@app.route('/informe', methods = ['POST','GET'])
def informe():
    global result
    if request.method == 'POST':
        result = request.form
    return render_template('Informe1.html')
    
@app.route('/usuario')
def consulta():
    return render_template('base.html')

@app.route('/nosotros')
def noso():
    return render_template('nosotros.html')
   
@app.route('/Graficas2', methods = ['POST','GET'])
def graf2():
    global result2
    if request.method == 'POST':
        result2 = request.form
    Eti = graficar_linea()
    Eti1 = Eti[0]
    Eti2 = Eti[1]
    Eti3 = Eti[2]
    return render_template('Graf1_1.html',
                           Etiquetas1=Eti1,
                           Cant1=len(Eti1),
                           Etiquetas2=Eti2,
                           Cant2=len(Eti2),                           
                           Etiquetas3=Eti3,
                           Cant3=len(Eti3))

@app.route('/Graficas', methods = ['POST','GET'])
def graf():
    global result2
    if request.method == 'POST':
        result2 = request.form
    Eti = graficar_linea()
    Eti1 = Eti[0]
    Eti2 = Eti[1]
    Eti3 = Eti[2]
    return render_template('Graf.html',
                           Etiquetas1=Eti1,
                           Cant1=len(Eti1),
                           Etiquetas2=Eti2,
                           Cant2=len(Eti2),                           
                           Etiquetas3=Eti3,
                           Cant3=len(Eti3))
    
@app.route('/Graficas_1')
def graf_a():
    col_list=[]
    for i in range(1,4):       
        AR=operardb_geof(0, "SITB_SenEst"+str(i), 0 ,"Consulta2")
        col_list.append(AR)
    Eti1=col_list[0]['Sen1_Columnas'].values
    Eti2=col_list[1]['Sen2_Columnas'].values
    Eti3=col_list[2]['Sen3_Columnas'].values

    return render_template('graficas.html',
                           Etiquetas1=Eti1,
                           Cant1=len(Eti1),
                           Etiquetas2=Eti2,
                           Cant2=len(Eti2),                           
                           Etiquetas3=Eti3,
                           Cant3=len(Eti3))

@app.route('/mapa4')
def maps4():
    df=operardb_geof([], 'SITB_ImgRaster', 0 ,"Consulta2")
    print(df)
    Nomb_Ima=df['Ima_Nom'].values
    Ima=df['Ima_Imagen'].values
    ruta = 'static/Temp_ima/'+Nomb_Ima[0]+'.TIF'
    
    Leer_Ima_base64(ruta, Ima[0])
    return render_template('mapas_1.html',
                           dire=ruta)

@app.route('/mapa3')
def maps3():
    ruta = 'static/Grafico4.png'
    return render_template('mapas_1.html',
                           dire=ruta)

@app.route('/mapa2')
def maps2():
    ruta = 'static/Grafico3.png'
    return render_template('mapas_1.html',
                           dire=ruta)

@app.route('/mapa1')
def maps1():
    ruta = 'static/Grafico2.png'
    return render_template('mapas_1.html',
                           dire=ruta)

@app.route('/mapa')
def maps():
    #Traer Archivo 1 de la base de datos y convertirlo en objeto para verlo
    df1=operardb_geof([], "SITB_AreaEstudio", "Ae_Geometria", "Consulta")
    dfa1=df1.drop(['Ae_Id', 'Ae_Estado', 'Ae_UsuarioReg', 'Ae_FechaReg', 'Ae_UsuarioMod', 'Ae_FechaMod'], axis=1)
    dfa1['Ae_Geometria'] = dfa1['Ae_Geometria'].apply(wkt.loads)
    Archivo1 = gpd.GeoDataFrame(dfa1, geometry='Ae_Geometria')
    #Traer Archivo 2 de la base de datos y convertirlo en objeto para verlo
    df1=operardb_geof([], "SITB_AreaInfluencia", "ArIn_Geometria", "Consulta")
    dfa1=df1.drop(['ArIn_Estado', 'ArIn_UsuarioReg', 'ArIn_FechaReg', 'ArIn_UsuarioMod', 'ArIn_FechaMod'], axis=1)
    dfa1['ArIn_Geometria'] = dfa1['ArIn_Geometria'].apply(wkt.loads)
    Archivo2 = gpd.GeoDataFrame(dfa1, geometry='ArIn_Geometria')
    #Traer Archivo 3 de la base de datos y convertirlo en objeto para verlo
    df1=operardb_geof([], "SITB_Estacion", "Est_Geometria", "Consulta")
    dfa1=df1.drop(['Est_Estado', 'Est_UsuarioReg', 'Est_FechaReg', 'Est_UsuarioMod', 'Est_FechaMod'], axis=1)
    dfa1['Est_Geometria'] = dfa1['Est_Geometria'].apply(wkt.loads)
    Archivo3 = gpd.GeoDataFrame(dfa1, geometry='Est_Geometria')
    
    #Graficar
    fig, ax = plt.subplots(figsize = (10,10))
    Archivo1.plot(ax=ax, edgecolor='k', alpha=0.1)
    ax.set_ylabel('Latitud', fontsize=18)
    ax.set_xlabel('Longitud', fontsize=18)
    ax.set_title('Área de estudio', fontsize=20)
    
    #Archivo1.crs = "epsg:4326"
    #map_df = Archivo1.to_crs(epsg=3857)
    #map_df.plot(ax = ax, figsize=(10, 10), alpha=0.5, edgecolor='g')
    ctx.add_basemap(ax, zoom=12, crs=Archivo1.crs, source=ctx.providers.Stamen.TonerLite)
    ax.set_axis_off()       
    fig.savefig('static/Grafico2.png')

    fig, ax = plt.subplots(figsize = (10,10))
    Archivo1.plot(ax=ax, color='black')
    Archivo2.plot(ax=ax, marker='o', cmap = 'rainbow',alpha = .1 )
    ax.set_ylabel('Latitud', fontsize=18)
    ax.set_xlabel('Longitud', fontsize=18)
    ax.set_title('Área de influencia de la estación', fontsize=20)
    fig.savefig('static/Grafico3.png')

    fig, ax = plt.subplots(figsize = (10,10))
    Archivo2.plot(ax=ax, marker='o', cmap = 'rainbow',alpha = .1)
    Archivo3.plot(ax=ax, color='black')
    ax.set_ylabel('Latitud', fontsize=18)
    ax.set_xlabel('Longitud', fontsize=18)
    ax.set_title('Estación Meteorologica', fontsize=20)
    fig.savefig('static/Grafico4.png')

    sleep(5)
    return render_template('mapas.html')
  
@app.route('/admin')
def admin_bd():
    return render_template('admin1.html', aviso="Ingrese su nombre de usuario y contraseña.")

@app.route('/admin2', methods = ['POST','GET'])
def admin_bd2():
    global Lista_sql
    global OPT
    OPT="Consulta"
    if request.method == 'POST':
        datos_usuario = request.form
        Nombre_Usuario=datos_usuario.get('Documentoa')
        Clave_Usuario=datos_usuario.get('Clavea')
        if(Nombre_Usuario=="12345" and Clave_Usuario=="0000"):
            #Listas para almacenamiento temporal de las tablas disponibles
            Lista_sql=operardb_geof(0, 0, 0 ,"Consulta3")
            etiquetas=[]
            for i in Lista_sql['name']:
                etiquetas.append(i)
            return render_template('Admin_A.html', 
                                   eti=etiquetas,
                                   Cant1=len(etiquetas)
                                   )
        else:
            return render_template('admin1.html', aviso="Verifique su nombre de usuario o contraseña.")

@app.route('/admin3', methods = ['POST','GET'])
def admin_bd3():
    global Lista_sql
    global opcion_lista
    global OPT
    if request.method == 'POST':
        Formulario=request.form
        opcion_lista=Formulario
        OPT=Formulario.get('Accion')
        if(Formulario.get('Accion')=="Consulta"):
            Lista_sql=operardb_geof(0, Formulario.get('Tabla'), 0 ,"Consulta2")
        if(Formulario.get('Accion')=="Borrar1"):
            operardb_geof(0, Formulario.get('Tabla'), 0 ,"Borrar1")
        if(Formulario.get('Accion')=="Borrar2"):
            operardb_geof(0, Formulario.get('Tabla'), 0 ,"Borrar2")
        #Listas para almacenamiento temporal de los datos de usuario
        Lista_sql2=operardb_geof(0, 0, 0 ,"Consulta3")
        etiquetas=[]
        for i in Lista_sql2['name']:
            etiquetas.append(i)
        
        return render_template('Admin_A.html', 
                               eti=etiquetas,
                               Cant1=len(etiquetas)
                               )
           
@app.route('/admin4', methods = ['POST','GET'])
def admin_bd4():
    global Lista_sql
    global opcion_lista
    global OPT
    if('opcion_lista' in globals()):
        Eti_tb=opcion_lista.get('Tabla')
    else:
        Eti_tb="SITB_Estacion_1"
        
    if(OPT=="Consulta" or OPT=="Borrar1"):
        ET=[]
        if(len(Lista_sql)>100):
            t=100
            A=Lista_sql.tail(t)
        else:
            A=Lista_sql
            if(Eti_tb=="SITB_ImgRaster"):
                A=A.drop(['Ima_Imagen'], axis=1)
            elif(Eti_tb=="SITB_AreaEstudio"):
                A=A.drop(['Ae_Geometria'], axis=1)
            elif(Eti_tb=="SITB_AreaInfluencia"):
                A=A.drop(['ArIn_Geometria'], axis=1)
            elif(Eti_tb=="SITB_Estacion"):
                A=A.drop(['Est_Geometria'], axis=1)
        for i,row in A.iterrows():
            ET.append(row)
        NC=A.columns.values
        if (len(ET)<2):
            can=len(NC)
        else:
            can=len(ET)
        return render_template('Admin_B.html', 
                               Nom_col=NC,
                               Etiquetas=ET,
                               Cant2=len(NC))    
    elif(OPT=="Crear"):
        return render_template('Admin_C.html', texto="Ingrese datos para generar la tabla.")
    else:
        if(Eti_tb=="Sen_Est_1"):
            return Sensores(1,"002056BF.")
        elif(Eti_tb=="Sen_Est_2"):
            return Sensores(2,"00206878.")
        elif(Eti_tb=="Sen_Est_3"):
            return Sensores(3,"0020687D.")
        elif(Eti_tb=="SITB_ImgRaster"):
            return render_template('Admin_E.html', texto="Diligencie este formulario.")
        elif(Eti_tb=="SITB_AreaEstudio"):
            return render_template('Admin_F.html', texto="Diligencie este formulario.")
        elif(Eti_tb=="SITB_AreaInfluencia"):
            return render_template('Admin_G.html', texto="Diligencie este formulario.")
        elif(Eti_tb=="SITB_Estacion"):
            return render_template('Admin_H.html', texto="Diligencie este formulario.")
        elif(Eti_tb=="SITB_EstacionVar"):
            return render_template('Admin_K.html', texto="Diligencie este formulario.")
        else:
            return render_template('RTA_2.html', rta="No es posible modificar los registros de esta tabla.")    

@app.route('/admin5', methods = ['POST','GET'])
def admin_bd5():
    if request.method == 'POST':
        Formu=request.form
        if(Formu.get('Nombre tabla')!='' and Formu.get('Salida_sql')!=''):
            sql = "CREATE TABLE "+Formu.get('Nombre tabla')+" ("+Formu.get('Salida_sql')+");"
            operardb_geof(0, sql, 0 ,"Crear")
            return render_template('Admin_C.html', texto="Tabla generada de forma exitosa.")
        else:
            return render_template('Admin_C.html', texto="Error al crear la tabla.")

@app.route('/admin6', methods = ['POST','GET'])
def admin_bd6():
    if request.method == 'POST':
        Formu=request.form
        if(request.files['adjunto'].filename!=''):
            try:
                archivo = request.files['adjunto']
                nombre_archivo=os.path.join(uploads_dir, secure_filename(archivo.filename))
                archivo.save(nombre_archivo)
                var_id=0
                if(Formu['Txt']=="Capacidad de campo del suelo"):
                    var_id=8
                elif(Formu['Txt']=="Humedad relativa promedio multianual"):
                    var_id=2
                elif(Formu['Txt']=="Punto de marchitez permanente"):
                    var_id=7
                elif(Formu['Txt']=="Precipitación promedio multianual"):
                    var_id=3
                elif(Formu['Txt']=="Temperatura mínima del aire promedio multianual"):
                    var_id=6
                      
                aux=[[var_id], [Formu['Nomima']], [Formu['Txt']], [Crear_archivo_base_64(nombre_archivo)] , [Formu['Fecha_reg']+" "+Formu['Horas_reg']], [Formu['Nomusu']], [Formu['Fecha_reg']+" "+Formu['Horas_reg']], [Formu['Nomusu']]]
                df = pd.DataFrame(aux)
                df=df.transpose()
                df.columns= ['Var_Id', 'Ima_Nom','Ima_Desc', 'Ima_Imagen', 'Ima_FechaReg', 'Ima_UsuarioReg', 'Ima_FechaMod', 'Ima_UsuarioMod']
                operardb_geof(df, 'SITB_ImgRaster', 0 ,"Actualizar")                
                os.remove(nombre_archivo)
            except:
                return render_template('RTA_2.html', rta="No se ha cargado el registro con exito")
        return render_template('RTA_2.html', rta="Registro actualizado con exito.")

@app.route('/admin7', methods = ['POST','GET'])
def admin_bd7():
    if request.method == 'POST':
        Formu=request.form
        if(request.files['adjuntos'].filename!=''):
            try:
                Lista_arch = request.files.getlist('adjuntos')
                Lista_nomb = []
                for i in Lista_arch:
                    nombre_archivo=os.path.join(uploads_dir, i.filename)
                    i.save(nombre_archivo) 
                    Lista_nomb.append(nombre_archivo)
                str_match = [s for s in Lista_nomb if s.__contains__(".shp")]
                Arch = gpd.read_file(str_match[0])
                Cargar_archivos_shp(Arch, 0, Formu['Esta'], Formu['Nomusu'], Formu['Fecha_reg']+" "+Formu['Horas_reg'])   
                for i in Lista_arch:
                    nombre_archivo=os.path.join(uploads_dir, i.filename)              
                    os.remove(nombre_archivo)
            except:         
                return render_template('RTA_2.html', rta="No se ha cargado el registro con exito")
        return render_template('RTA_2.html', rta="Registro actualizado con exito.")
    
@app.route('/admin8', methods = ['POST','GET'])
def admin_bd8():
    if request.method == 'POST':
        Formu=request.form
        if(request.files['adjuntos'].filename!=''):
            try:
                Lista_arch = request.files.getlist('adjuntos')
                Lista_nomb = []
                for i in Lista_arch:
                    nombre_archivo=os.path.join(uploads_dir, i.filename)
                    i.save(nombre_archivo) 
                    Lista_nomb.append(nombre_archivo)
                str_match = [s for s in Lista_nomb if s.__contains__(".shp")]
                Arch = gpd.read_file(str_match[0])
                Cargar_archivos_shp(Arch, 1, Formu['Esta'], Formu['Nomusu'], Formu['Fecha_reg']+" "+Formu['Horas_reg'])   
                for i in Lista_arch:
                    nombre_archivo=os.path.join(uploads_dir, i.filename)              
                    os.remove(nombre_archivo)
            except:         
                return render_template('RTA_2.html', rta="No se ha cargado el registro con exito")
        return render_template('RTA_2.html', rta="Registro actualizado con exito.")

@app.route('/admin9', methods = ['POST','GET'])
def admin_bd9():
    if request.method == 'POST':
        Formu=request.form
        if(request.files['adjuntos'].filename!=''):
            try:
                Lista_arch = request.files.getlist('adjuntos')
                Lista_nomb = []
                for i in Lista_arch:
                    nombre_archivo=os.path.join(uploads_dir, i.filename)
                    i.save(nombre_archivo) 
                    Lista_nomb.append(nombre_archivo)
                str_match = [s for s in Lista_nomb if s.__contains__(".shp")]
                Arch = gpd.read_file(str_match[0])
                Cargar_archivos_shp(Arch, 2, Formu['Esta'], Formu['Nomusu'], Formu['Fecha_reg']+" "+Formu['Horas_reg'])   
                for i in Lista_arch:
                    nombre_archivo=os.path.join(uploads_dir, i.filename)              
                    os.remove(nombre_archivo)
            except:         
                return render_template('RTA_2.html', rta="No se ha cargado el registro con exito")
        return render_template('RTA_2.html', rta="Registro actualizado con exito.")

@app.route('/admin10', methods = ['POST','GET'])
def admin_bd10():
    global Lista_sql
    global Formu2
    if('Formu2' in globals()):
        Eti_tb=Formu2.get('Tabla')
    else:
        Eti_tb="SITB_Estacion_1"
        
    ET=[]
    if(len(Lista_sql)>100):
        t=100
        A=Lista_sql.tail(t)
    else:
        A=Lista_sql
        if(Eti_tb=="SITB_ImgRaster"):
            A=A.drop(['Ima_Imagen'], axis=1)
        elif(Eti_tb=="SITB_AreaEstudio"):
            A=A.drop(['Ae_Geometria'], axis=1)
        elif(Eti_tb=="SITB_AreaInfluencia"):
            A=A.drop(['ArIn_Geometria'], axis=1)
        elif(Eti_tb=="SITB_Estacion"):
            A=A.drop(['Est_Geometria'], axis=1)
    for i,row in A.iterrows():
        ET.append(row)
    NC=A.columns.values
    return render_template('Admin_B.html', 
                           Nom_col=NC,
                           Etiquetas=ET,
                           Cant2=len(NC))    

@app.route('/admin11', methods = ['POST','GET'])
def admin_bd11():
    if request.method == 'POST':
        Formu=request.form
        if(request.files['adjunto'].filename!=''):
            try:
                archivo = request.files['adjunto']
                nombre_archivo=os.path.join(uploads_dir, secure_filename(archivo.filename))
                archivo.save(nombre_archivo)
                df=Leer_excel_df(nombre_archivo, [Formu['Fecha_reg']+" "+Formu['Horas_reg']], [Formu['Nomusu']])  
                operardb_geof(df, 'SITB_EstacionVar', 0 ,"Actualizar")                
                os.remove(nombre_archivo)
            except:
                return render_template('RTA_2.html', rta="No se ha cargado el registro con exito")
        return render_template('RTA_2.html', rta="Registro actualizado con exito.")


@app.route('/busqueda', methods = ['POST','GET'])
def busque_pag():
    global Lista_sql
    global Formu2
    Lista_con=operardb_geof(0, 0, 0 ,"Consulta3")
    if request.method == 'POST':
        Formu2=request.form
        Lista_sql=operardb_geof(0, Formu2.get('Tabla'), 0 ,"Consulta2")
    else:
        Lista_sql=Lista_con
    etiquetas=[]
    for i in Lista_con['name']:
        etiquetas.append(i)
    return render_template('Admin_I.html', 
                           eti=etiquetas,
                           Cant1=len(etiquetas)
                           )    
    
def correr_pag():
    app.run(host='0.0.0.0', port='8080')

def Leer_excel_df(ruta, fecha, usuario):
    Excel=pd.ExcelFile(ruta)
    Hojas=Excel.sheet_names
    Li=[]
    Li2=[]
    anno="1900"
    for i in Hojas:
        Ar=Excel.parse(i)
        NC=list(Ar.columns)
        if(i=='Brillo_solar'):
            Var=1
        elif(i=='Humedad_relativa'):
            Var=2
        elif(i=='Precipitacion'):
            Var=3        
        elif(i=='Temperatura_maxima'):
            Var=4
        elif(i=='Temperatura_media'):
            Var=5
        elif(i=='Temperatura_minima'):
            Var=6
        else:
            Var=0
        for y, j in Ar.iterrows():
            Li.append(Var)
            for k in NC:
                if(k=='COD' or k=='ESTACION' or k=='LAT' or k=='LONG' or k=='ELEV' or k=='ALTURA' or k=='AÑO' or k=='ANO'):
                    Li.append(j[k])
                    if(k=='AÑO' or k=='ANO'):
                        anno=str(j[k])
                elif(k=='ENE' or k=='FEB' or k=='MAR' or k=='ABR' or k=='MAY' or k=='JUN' or  
                     k=='JUL' or k=='AGO' or k=='SEP' or k=='OCT' or k=='NOV' or k=='DIC'):
                    if(k=='ENE'):
                        b="01"
                        c="31"
                    elif(k=='FEB'):
                        b="02"
                        c="28"
                    elif(k=='MAR'):
                        b="03"
                        c="31"
                    elif(k=='ABR'):
                        b="04"
                        c="30"
                    elif(k=='MAY'):
                        b="05"
                        c="31"
                    elif(k=='JUN'):
                        b="06"
                        c="30"
                    elif(k=='JUL'):
                        b="07"
                        c="31"
                    elif(k=='AGO'):
                        b="08"
                        c="31"
                    elif(k=='SEP'):
                        b="09"
                        c="30"
                    elif(k=='OCT'):
                        b="10"
                        c="31"
                    elif(k=='NOV'):
                        b="11"
                        c="30"
                    elif(k=='DIC'):
                        b="12"
                        c="31"
                    a=[anno+"-"+b+"-"+c+" 12:00:00"]
                    Li2.append(Li+a+[j[k]]+fecha+usuario+fecha+usuario)
            Li=[]
    df=pd.DataFrame(Li2, columns=['Var_Id','Est_Id', 'EsVa_Estacion', 'EsVa_Latitud', 'EsVa_Longitud', 'EsVa_Altura',
                                  'EsVa_Annio', 'EsVa_Fecha', 'EsVa_Valor', 'EsVa_FechaReg', 'EsVa_UsuarioReg', 'EsVa_FechaMod', 'EsVa_UsuarioMod'])
    return df
        
#Función principal    
if __name__ == '__main__':
#    hilo1 = threading.Thread(target=Actualizar_pag)
    hilo2 = threading.Thread(target=correr_pag)
#    hilo1.start()
    hilo2.start()  