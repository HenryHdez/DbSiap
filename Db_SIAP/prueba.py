import requests
from requests.auth import AuthBase
from Crypto.Hash import HMAC
from Crypto.Hash import SHA256
from datetime import datetime
from dateutil.tz import tzlocal
import json
import pandas as pd

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
        print("timestamp: ", dateStamp)
        request.headers['Date'] = dateStamp
        msg = (self._method + self._apiRoute + dateStamp + self._publicKey).encode(encoding='utf-8')
        h = HMAC.new(self._privateKey.encode(encoding='utf-8'), msg, SHA256)
        signature = h.hexdigest()
        request.headers['Authorization'] = 'hmac ' + self._publicKey + ':' + signature
        return request

# Endpoint of the API, version for example: v1
apiURI = 'https://api.fieldclimate.com/v1'

# HMAC Authentication credentials
publicKey = '302ead2262739c6e79253adf70ca808da9d956488f380b67'
privateKey = '6fc194ada406785b9e58b8c23b8a0d60da4f23ec373dfe20'

# Service/Route that you wish to call
apiRoute = '/user'
apiRoute = '/data/normal/002056BF/hourly/from/1471382745/to/1629062745'

auth = AuthHmacMetosGet(apiRoute, publicKey, privateKey)
response = requests.get(apiURI+apiRoute, headers={'Accept': 'application/json'}, auth=auth)
json_temp=response.json()
Nombres=json_temp['sensors']
datos=json_temp['data']
llaves=[]
nombres_sens=['Fecha']
aux=[]
lista_datos=[]
for llave in datos[0]:
    llaves.append(llave)

for i in llaves:
    for j in Nombres:
        eti=(str(j['ch'])+'_'+
            str(j['serial'])+'_'+
            str(j['mac'])+'_'+
            str(j['code']))
        print(eti)
        print(i[0:len(eti)])
        if(i[0:len(eti)]==eti):
            nombres_sens.append(j['name']+i[len(eti):len(i)])
        
print(nombres_sens)

for i in datos:
    for j in llaves:
        aux.append(i[j])
    lista_datos.append(aux)
    aux=[]

df=pd.DataFrame(lista_datos,columns=nombres_sens)
df.to_excel('reporte.xls')
#print(lista_datos)