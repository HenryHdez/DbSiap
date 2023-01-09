# -*- coding: utf-8 -*-
import pymssql 

try:
    cnxn = pymssql.connect(host='COMOSDSQL08\MSSQL2016DEX',
                           database='SEMapa',
                           user='WebSeMapa',
                           password='rdTGWjLYWIH6e0PKeXYl')
                           #host='172.16.11.44\MSSQL2016DSC', 
                           #database='SistemaExpertoPanela', 
                           #user='WebSisExpPanela', 
                           #password='sIuusnOsE9bLlx7g60Mz') 
    cursor = cnxn.cursor()         
    cursor.execute("SELECT * FROM Estacion")
except:
    print("Error")