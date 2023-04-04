var Fechas = []
var Eto_Calc_mm_d_1 = []
var Etc_mm_d_1 = []
var Precipitacion_mm = [];
//Atributos de la matriz
let Fecha = []; //          R[1]
let P_mm = []; //P(mm)          R[2]
let Eto_mm = []; //Eto(mm)      R[3]
let J = []; //dia               R[4]
let Longitud_raiz_m = []; // R[5]
let Kc = []; // R[6]
let ADT_mm = []; // R[7]
let p_aj_mm = []; // R[8]
let AFA_mm = []; // R[9]
let Lamina_bruta_mm = []; //R[10]
let P_efec_mm = []; //R[11]
let Ks = []; //R[13] 
let ETcaj_mm = []; //R[14]  
let Perc_Prof_mm = []; //R[15]
let Dr_Final_mm = []; //R[16]
let bandera = false;
let opc1 = 0;

function Total_dias() {
    if (opc1 == 3) {
        var Hoy = new Date("2021-09-10");
    } else { var Hoy = new Date(); }
    var Hoy_str = Hoy.getFullYear() + "-" + (Hoy.getMonth() + 1) + "-" + Hoy.getDate();
    var Fecha_siem = document.getElementById("Fechao").value;
    var uno_d = new Date(Hoy_str);
    var dos_d = new Date(Fecha_siem);
    var Total_d = Math.round((uno_d.getTime() - dos_d.getTime()) / (1000 * 60 * 60 * 24));
    return Total_d;
}

function formato_fecha(fech_mem) {
    var dd = fech_mem.getDate();
    var mm = fech_mem.getMonth() + 1; //January is 0!
    var yyyy = fech_mem.getFullYear();
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
    fech_mem = yyyy + '-' + mm + '-' + dd;
    return fech_mem;
}

function saturador(eti) {
    if (document.getElementById(eti).max < document.getElementById(eti).value) {
        document.getElementById(eti).value = document.getElementById(eti).max;
    }
    if (document.getElementById(eti).value < document.getElementById(eti).min) {
        document.getElementById(eti).value = document.getElementById(eti).min;
    }
}

function Var_iniciales() {
    //Condiciones iniciales
    var today = formato_fecha(new Date());
    document.getElementById("Fechao").disabled = false;
    document.getElementById("Fechao").max = today;
    document.getElementById("Fechao").min = "2020-01-01";
    document.getElementById("Fechao").value = "2022-06-06";
    var Tot_dia = Total_dias();
    if (Tot_dia < 152) {
        document.getElementById("dias").value = Tot_dia;
        document.getElementById("dias").max = Tot_dia;
    } else {
        document.getElementById("dias").value = 152;
        document.getElementById("dias").max = 152;
    }

    //OPCIÓN
    opc1 = document.getElementById("opcion_dat").value;

    if (opc1 == 1) {
        document.getElementById("Fechao").disabled = true;
        document.getElementById("dias").value = 138;
        document.getElementById("CC").value = 77.7;
        document.getElementById("PMP").value = 54.95;
        document.getElementById("DA").value = 0.646;
        document.getElementById("Kco").value = 0.86;
        document.getElementById("Kcm").value = 1.07;
        document.getElementById("Kcf").value = 0.67;
        document.getElementById("Fa1").value = 0.35;
        document.getElementById("dias").max = 138;
        document.getElementById("Fechao").value = "2021-02-03";
    } else if (opc1 == 2) {
        document.getElementById("CC").value = 77.7;
        document.getElementById("PMP").value = 54.95;
        document.getElementById("DA").value = 0.646;
        document.getElementById("Kco").value = 0.86;
        document.getElementById("Kcm").value = 1.07;
        document.getElementById("Kcf").value = 0.67;
        document.getElementById("Fa1").value = 0.35;
    } else if (opc1 == 3) {
        document.getElementById("CC").value = 77.7;
        document.getElementById("PMP").value = 54.95;
        document.getElementById("DA").value = 0.646;
        document.getElementById("Kco").value = 0.86;
        document.getElementById("Kcm").value = 1.07;
        document.getElementById("Kcf").value = 0.67;
        document.getElementById("Fa1").value = 0.35;
        document.getElementById("Fechao").value = "2021-01-01";
        document.getElementById("Fechao").max = "2021-09-09";
    } else if (opc1 == 4) {
        document.getElementById("CC").value = 77.7;
        document.getElementById("PMP").value = 54.95;
        document.getElementById("DA").value = 0.646;
        document.getElementById("Kco").value = 0.86;
        document.getElementById("Kcm").value = 1.07;
        document.getElementById("Kcf").value = 0.67;
        document.getElementById("Fa1").value = 0.35;
    }
}

function act_fecha_dia() {
    var Total_d = Total_dias();
    if (Total_d < 152) {
        document.getElementById("dias").value = Total_d;
        document.getElementById("dias").max = Total_d;
    } else {
        document.getElementById("dias").value = 152;
        document.getElementById("dias").max = 152;
    }
    document.getElementById("dias").disabled = false;
    if (Total_d <= 0) {
        document.getElementById("dias").disabled = true;
        document.getElementById("dias").value = 1;
    }
}

function Leer_csv() {
    if (document.getElementById("dias").value <= 0) {
        document.getElementById("dias").value = 1;
    }
    if (bandera == false) {
        Var_iniciales();
        bandera = true;
    }
    try {
        let longitud = parseInt(document.getElementById("dias").value);
        var Fecha_siem = document.getElementById("Fechao").value;
        opc1 = document.getElementById("opcion_dat").value;
        //Reiniciar valores
        Fechas = []
        Eto_Calc_mm_d_1 = []
        Etc_mm_d_1 = []
        Precipitacion_mm = [];
        //Atributos de la matriz
        Fecha = []; //R[1]
        P_mm = []; //R[2]    P(mm)          
        Eto_mm = []; //R[3]    Eto(mm)      
        J = []; //R[4]    dia               
        Longitud_raiz_m = []; //R[5]
        Kc = []; //R[6]
        ADT_mm = []; //R[7]
        p_aj_mm = []; //R[8]
        AFA_mm = []; //R[9]
        Lamina_bruta_mm = []; //R[10]
        P_efec_mm = []; //R[11]
        Ks = []; //R[13] 
        ETcaj_mm = []; //R[14]  
        Perc_Prof_mm = []; //R[15]
        Dr_Final_mm = []; //R[16]
        //Leer csv
        if (opc1 <= 1) {
            var array = archivojson();
            //Leer fechas
            for (var i = 0; i < longitud; i++) {
                Fechas.push(array[i]["Fecha"].toString());
                Eto_Calc_mm_d_1.push(+array[i]["Eto_Calc_mm_d-1"]);
                Etc_mm_d_1.push(+array[i]["Etc_mm_d-1"]);
                Precipitacion_mm.push(+array[i]["Precipitacion (mm)"]);
            }
            /*Vector de fechas
            const inicio = new Date(Fecha_siem);
            for (var i = 0; i < longitud; i++) {
                inicio.setDate(inicio.getDate() + 1);
                let feaux = " " + inicio
                Fechas.push(feaux);
            }*/
        } else {
            var Est = 0;
            var Fech = "Est1_Fecha";
            if (opc1 == 2) {
                Est = JSON.parse(Estacion1);
                Fech = "Est1_Fecha";
            } else if (opc1 == 3) {
                Est = JSON.parse(Estacion2);
                Fech = "Est2_Fecha";
            } else {
                Est = JSON.parse(Estacion3);
                Fech = "Est3_Fecha";
            }
            //Datos de la estacion
            var Fecha_siem_1 = document.getElementById("Fechao").value;
            var Fecha_siem_2 = new Date(Fecha_siem_1);
            Fecha_siem_2.setDate(Fecha_siem_2.getDate() + longitud);
            Fecha_siem_2 = formato_fecha(Fecha_siem_2);
            let L_json = Object.keys(Est[0][Fech]).length;
            //Extraer del json
            for (var i = 0; i < longitud; i++) {
                var memoria_ETO = 0;
                var memoria_Prec = 0;
                var Fecha_siem_3 = new Date(Fecha_siem_1);
                Fecha_siem_3.setDate(Fecha_siem_3.getDate() + i);
                Fecha_siem_3 = formato_fecha(Fecha_siem_3).toString();
                for (var j = 0; j < L_json; j++) {
                    var Fecha_temp = formato_fecha(new Date(Est[0][Fech][j].toString()));
                    if (Fecha_temp == Fecha_siem_3) {
                        memoria_ETO = parseFloat(Est[0]["E3_Evapotrans"][j]) + memoria_ETO;
                        memoria_ETO = Math.round(memoria_ETO * 100) / 100;
                        memoria_Prec = parseFloat(Est[0]["A2_Precipitation_sum"][j]) + memoria_Prec;
                        memoria_Prec = Math.round(memoria_Prec * 100) / 100;
                    }
                }
                Fechas.push(Fecha_siem_3);
                Eto_Calc_mm_d_1.push(memoria_ETO);
                console.log(Eto_Calc_mm_d_1)
                Precipitacion_mm.push(memoria_Prec);
            }
        }
        //Promedio
        let sum = Eto_Calc_mm_d_1.reduce((previous, current) => current += previous);
        let mean = sum / Eto_Calc_mm_d_1.length;
        //DATOS DE ENTRADA
        let delta = 1; //delta de dias para simular

        //Suelo
        let CC = parseFloat(document.getElementById("CC").value); //77.7; //Capacidad de campo a 0.1 cbar(%g) (52 % vol_3, 49.2%_2, 53.53%_1)
        let pmp = parseFloat(document.getElementById("PMP").value); //54.95; //Punto de marchitez permanente (%g)(35.5% vol_3, 29.5%_2,35.1%_1)
        let da = parseFloat(document.getElementById("DA").value); //0.646; //Densidad aparente (-)(0.646_3, 0.65_2,0.646_1) 
        //Planta
        let Rmin = 0.05; //Longitud de raíz máxima(m) 
        let Rmax = 0.30; //Longitud de raá½z máxima (m)
        let Jini = 1; //Tiempo de crecimiento de la raíz (dia)
        let Jmax = 66;
        let Kyini = 0.45; //Factor del cultivo 
        let Kydes = 0.8; //Factor del cultivo 
        let Kymed = 0.7; //Factor del cultivo 
        let Kyfin = 0.2; //Factor del cultivo 
        let Kcini = parseFloat(document.getElementById("Kco").value); // 0.86; //Coeficientes del cultivo por etapas
        let Kcmed = parseFloat(document.getElementById("Kcm").value); // 1.07;
        let Kcfin = parseFloat(document.getElementById("Kcf").value); // 0.67;
        let Lini = 27; // Duración etapa (dias) Para ciclo 2:35
        let Ldes = 39; // Para ciclo 2:30
        let Lmed = 47; // Para ciclo 2:53
        let Lfin = 42; // Para ciclo 2:20
        let pini = parseFloat(document.getElementById("Fa1").value); //0.35; //Factor de agotamiento (-)
        let pdes = parseFloat(document.getElementById("Fa1").value); //
        //////Calculo de agua disponible total//
        let ADT = 1000 * ((CC - pmp) / 100) * da; //ADT (mm/m)
        let a = 0.9; //Porcentaje para Precipitacion efectiva
        //Agotamiento inicial de agua en el suelo
        let Dr0 = 10; // Cero para iniciar a capacidad de campo
        let k = Lini + Ldes + Lmed + Lfin;
        let ciclo = Lini + Ldes + Lmed + Lfin;
        let nr = longitud;
        let dia = 1; //dia que inicia el balance. Se asume que inicia en capacidad de campo
        let con = 1;
        //Crear variables de dataframe en JS
        //let x = matrix(data = NA, nrow = nr, ncol = 19, byrow = FALSE, dimnames = NULL)
        //let R = data.frame(x)
        //Llenar matriz
        for (var j = con - 1; j < nr; j++) {
            J.push(dia + j);
            //Calculo de la longitud de raíz
            if (J[j] <= Jini) {
                Longitud_raiz_m.push(Rmin);
            } else
            if (J[j] <= Jmax) {
                let num_aux = Rmin + ((Rmax - Rmin) * ((J[j] - Jini) / (Jmax - Jini)));
                num_aux = Math.round(num_aux * 100) / 100;
                Longitud_raiz_m.push(num_aux);
            } else {
                Longitud_raiz_m.push(Rmax);
            }
            //Cálculo de coeficiente del cultivo Kc
            if (J[j] <= Lini) {
                Kc.push(Kcini);
            } else if (J[j] <= (Lini + Ldes)) {
                var num_aux = Kcini + (((J[j] - Lini) / Ldes) * (Kcmed - Kcini));
                num_aux = Math.round(num_aux * 100) / 100;
                Kc.push(num_aux);
            } else if (J[j] <= (Lini + Ldes + Lmed)) {
                Kc.push(Kcmed);
            } else {
                var num_aux = Kcmed + (((J[j] - (Lini + Ldes + Lmed)) / Lfin) * (Kcfin - Kcmed));
                num_aux = Math.round(num_aux * 100) / 100;
                Kc.push(num_aux);
            }

            let num_aux_2 = 0;
            //Cálculo de la evapotranspiración del cultivo ajustado ETcaj
            num_aux_2 = Eto_Calc_mm_d_1[j] * Kc[j];
            num_aux_2 = Math.round(num_aux_2 * 100) / 100;
            ETcaj_mm.push(num_aux_2);

            //Cálculo de agua disponible total ADT
            num_aux_2 = ADT * Longitud_raiz_m[j];
            num_aux_2 = Math.round(num_aux_2 * 100) / 100;
            ADT_mm.push(num_aux_2);

            //Cálculo de factor de agotamiento  (cuadro 22 FAO 56)
            let num_aux_3 = 0;
            if (J[j] <= Lini + Ldes) {
                if (Longitud_raiz_m[j] == 5) {
                    num_aux_3 = pini;
                } else {
                    //num_aux_3 = Math.max(pini + (0.04 * (5 - Etc_mm_d_1[j])), 0.1);
                    num_aux_3 = Math.max(pini + (0.04 * (5 - ETcaj_mm[j])), 0.1);
                }
            } else {
                if (Longitud_raiz_m[j] == 5) {
                    num_aux_3 = pdes;
                } else {
                    //num_aux_3 = Math.max(pdes + (0.04 * (5 - Etc_mm_d_1[j])), 0.1);
                    num_aux_3 = Math.max(pdes + (0.04 * (5 - ETcaj_mm[j])), 0.1);
                }
            }
            //num_aux_3 = Math.round(num_aux_3 * 100) / 100;

            p_aj_mm.push(num_aux_3);

            //Cálculo de agua fácilmente aprovechable AFA
            num_aux_2 = ADT_mm[j] * p_aj_mm[j];
            num_aux_2 = Math.round(num_aux_2 * 100) / 100;
            AFA_mm.push(num_aux_2);

            //Cálculo de lámina neta
            if (j == 0) {
                let Flag = 0;
                if (AFA_mm[j] <= Dr0) {
                    Flag = 1;
                }
                if (Flag == 0) {
                    Lamina_bruta_mm.push(Dr0);
                } else {
                    Lamina_bruta_mm.push(0);
                }
            } else {
                if (AFA_mm[j] <= Dr_Final_mm[j - 1]) {
                    Lamina_bruta_mm.push(Dr_Final_mm[j - 1]);
                } else {
                    Lamina_bruta_mm.push(0);
                }
            }
            //Cálculo de la precipitación efectiva
            num_aux_2 = Precipitacion_mm[j] * a;
            num_aux_2 = Math.round(num_aux_2 * 100) / 100;
            P_efec_mm.push(num_aux_2);
            //Cálculo del coeficiente de estrÃ©s hidrico Ks
            Ks.push(1);

            //Cálculo de la evapotranspiración del cultivo ajustado ETcaj 2
            //num_aux_2 = Etc_mm_d_1[j];
            //num_aux_2 = Math.round(num_aux_2 * 100) / 100;
            //ETcaj_mm.push(num_aux_2);

            //Cálculo de la percolación profunda
            if (j == 0) {
                if ((P_efec_mm[j] + Lamina_bruta_mm[j] - ETcaj_mm[j] - Dr0) < 0) {
                    Perc_Prof_mm.push(0);
                } else {
                    num_aux_2 = P_efec_mm[j] + Lamina_bruta_mm[j] - ETcaj_mm[j] - Dr0;
                    num_aux_2 = Math.round(num_aux_2 * 100) / 100;
                    Perc_Prof_mm.push(num_aux_2);
                }
            } else {
                if ((P_efec_mm[j] + Lamina_bruta_mm[j] - ETcaj_mm[j] - Dr_Final_mm[j - 1]) < 0) {
                    Perc_Prof_mm.push(0);
                } else {
                    num_aux_2 = P_efec_mm[j] + Lamina_bruta_mm[j] - ETcaj_mm[j] - Dr_Final_mm[j - 1];
                    num_aux_2 = Math.round(num_aux_2 * 100) / 100;
                    Perc_Prof_mm.push(num_aux_2);
                }
            }

            //Cálculo del agotamiento de agua final en el suelo Dr final
            if (j == 0) {
                num_aux_2 = Dr0 - P_efec_mm[j] + ETcaj_mm[j] - Perc_Prof_mm[j];
                num_aux_2 = Math.round(num_aux_2 * 100) / 100;
                Dr_Final_mm.push(num_aux_2); //Ya tiene el riego en Dr ini        
            } else {
                num_aux_2 = Dr_Final_mm[j - 1] - P_efec_mm[j] + ETcaj_mm[j] + Perc_Prof_mm[j] - Lamina_bruta_mm[j];
                num_aux_2 = Math.round(num_aux_2 * 100) / 100;
                Dr_Final_mm.push(num_aux_2);
            }
            P_mm.push(Precipitacion_mm[j]);
            Eto_mm.push(Eto_Calc_mm_d_1[j]);
        }
        //Aqui termina el codigo del balance

        //---Graficas---
        var df = {
            "y": {
                "P_mm": P_mm,
                "Eto_mm": Eto_mm,
            }
        };
        // Configuration
        var conf = {
            "graphType": "Bar"
        };
    } catch (err) {
        console.log(err);
    }
}

function graficar() {
    //Bloquear interfaz
    document.getElementById("Fechao").disabled = true;
    document.getElementById("dias").disabled = true;
    document.getElementById("CC").disabled = true;
    document.getElementById("PMP").disabled = true;
    document.getElementById("DA").disabled = true;
    document.getElementById("Kco").disabled = true;
    document.getElementById("Kcm").disabled = true;
    document.getElementById("Kcf").disabled = true;
    document.getElementById("Fa1").disabled = true;
    document.getElementById("dias").disabled = true;

    Leer_csv();

    for (let i = 0; i < Perc_Prof_mm.length; i++) {
        Perc_Prof_mm[i] = -1 * Perc_Prof_mm[i];
        AFA_mm[i] = -1 * AFA_mm[i];
        ADT_mm[i] = -1 * ADT_mm[i];
        Dr_Final_mm[i] = -1 * Dr_Final_mm[i];
    }

    // Definir datos a graficar
    var G1 = {
        x: J,
        y: P_efec_mm,
        name: 'P',
        type: 'bar',
        marker: {
            color: 'rgb(135,206,250)',
            size: 2,
            line: {
                color: 'rgb(135,206,250)',
                width: 2
            }
        }
    };

    var G2 = {
        x: J,
        y: Lamina_bruta_mm,
        name: 'R',
        type: 'bar',
        marker: {
            color: 'rgb(100,149,237)',
            size: 2,
            line: {
                color: 'rgb(100,149,237)',
                width: 2
            }
        }
    };

    var G3 = {
        x: J,
        y: Perc_Prof_mm,
        name: 'Perc',
        type: 'bar',
        marker: {
            color: 'rgb(205, 205, 205)',
            opacity: 0.8,
            size: 2,
            line: {
                color: 'rgb(130, 130, 130)',
                width: 1
            }
        }
    };

    var G4 = {
        x: J,
        y: AFA_mm,
        name: 'AFA',
        type: 'scatter',
        marker: {
            color: 'rgb(220, 20, 60)',
            opacity: 0.1,
            size: 2,
            line: {
                color: 'rgb(255, 0, 0)',
                width: 2
            }
        }
    };

    var G5 = {
        x: J,
        y: ADT_mm,
        name: 'ADT',
        type: 'scatter',
        marker: {
            color: 'rgb(0, 0, 0)',
            opacity: 0.1,
            size: 2,
            line: {
                color: 'rgb(0, 0, 0)',
                width: 2
            }
        }
    };

    var G6 = {
        x: J,
        y: Dr_Final_mm,
        name: 'Dr',
        fill: 'tozeroy',
        type: 'scatter',
        marker: {
            color: 'rgb(0, 0, 0)',
            opacity: 0.1,
            size: 2,
            line: {
                opacity: 0.1,
                color: 'rgb(0, 0, 0)',
                width: 3
            }
        }
    };

    var G7 = {
        x: J,
        y: ETcaj_mm,
        name: 'ETc',
        fill: 'tozeroy',
        type: 'scatter',
        marker: {
            color: 'rgb(255, 128, 0)',
            opacity: 0.5,
            size: 20,
            line: {
                color: 'rgb(255, 165, 0)',
                width: 2
            }
        }
    };

    let resalto = [];
    let dia_res = []
    for (let i = 0; i < Dr_Final_mm.length; i++) {
        if (Math.abs(AFA_mm[i]) < Math.abs(Dr_Final_mm[i])) {
            resalto.push(Dr_Final_mm[i]);
            dia_res.push(J[i]);
        }
    }

    var G9 = {
        x: dia_res,
        y: resalto,
        name: 'Um',
        type: 'scatter',
        mode: 'markers',
        marker: {
            color: 'rgb(255, 0, 0)',
            opacity: 0.5,
            size: 10,
            line: {
                color: 'rgb(255, 0, 0)',
                width: 2
            }
        }
    };

    var datos = [G6, G7, G3, G4, G5, G2, G1, G9];

    var l1 = {
        xaxis: { title: 'Días despues de siembra' },
        yaxis: { title: 'Lámina (mm)' },
        colorbar: true,
        barmode: 'relative',
        title: 'Balance hídrico',
        width: 500,
    };
    var l2 = {
        xaxis: { title: 'Días despues de siembra' },
        yaxis: { title: 'Lámina (mm)' },
        colorbar: true,
        barmode: 'relative',
        title: 'Balance hídrico',
        width: 1000
    };
    // Mostrar
    Plotly.newPlot("Vista_prev", datos, l1);
    Plotly.newPlot("Suelo_canva", datos, l2);

    var tam_Lam = Lamina_bruta_mm.length;
    var valor_salida = Lamina_bruta_mm[tam_Lam - 1];

    var Fecha_siem_5 = document.getElementById("Fechao").value;
    var Fecha_siem_6 = new Date(Fecha_siem_5);
    Fecha_siem_6.setDate(Fecha_siem_6.getDate() + tam_Lam + 1);
    Fecha_siem_6 = formato_fecha(Fecha_siem_6).toString();

    var Fecha_siem_7 = new Date();
    Fecha_siem_7 = formato_fecha(Fecha_siem_7).toString();

    if (valor_salida > 0 && (Fecha_siem_6 == Fecha_siem_7)) {
        $('#modal').modal('show');
        document.getElementById("Aviso_modal").innerHTML = "El dia de hoy debe aplicar una lamina bruta de " + valor_salida + " mm.";
    }

    //Crear tabla
    let tab1 = document.getElementById("tab_reporte");
    tab1.innerHTML = "";

    var tcab = document.createElement("thead");
    var tfot = document.createElement("tfoot");
    var tbod = document.createElement("tbody");
    //Rotulos cabeza
    var titulos = document.createElement("tr");
    var lista_titulos = ["Fecha", "Dia", "Prec", "ET0", "Dr", "ETc", "Perc", "AFA", "ADT", "R", "P"];
    for (let i = 0; i < lista_titulos.length; i++) {
        var celda = document.createElement("th");
        var textoCelda = document.createTextNode(lista_titulos[i]);
        celda.appendChild(textoCelda);
        titulos.appendChild(celda);
    }
    //Rotulos pie de pagina
    var piespag = document.createElement("tr");
    for (let i = 0; i < lista_titulos.length; i++) {
        var celda = document.createElement("th");
        var textoCelda = document.createTextNode(lista_titulos[i]);
        celda.appendChild(textoCelda);
        piespag.appendChild(celda);
    }

    //Contenido
    for (let i = 0; i < J.length; i++) {
        var fila = document.createElement("tr");
        for (let j = 0; j < 11; j++) {
            var celda = document.createElement("td");
            var textoCelda;
            if (j == 0) { textoCelda = document.createTextNode(Fechas[i].toString()); } else if (j == 1) { textoCelda = document.createTextNode(J[i].toString()); } else if (j == 2) { textoCelda = document.createTextNode(Precipitacion_mm[i].toString()); } else if (j == 3) { textoCelda = document.createTextNode(Eto_Calc_mm_d_1[i].toString()); } else if (j == 4) { textoCelda = document.createTextNode(Dr_Final_mm[i].toString()); } else if (j == 5) { textoCelda = document.createTextNode(ETcaj_mm[i].toString()); } else if (j == 6) { textoCelda = document.createTextNode(Perc_Prof_mm[i].toString()); } else if (j == 7) { textoCelda = document.createTextNode(AFA_mm[i].toString()); } else if (j == 8) { textoCelda = document.createTextNode(ADT_mm[i].toString()); } else if (j == 9) { textoCelda = document.createTextNode(Lamina_bruta_mm[i].toString()); } else if (j == 10) { textoCelda = document.createTextNode(P_efec_mm[i].toString()); }
            celda.appendChild(textoCelda);
            fila.appendChild(celda);
        }
        tbod.appendChild(fila);
    }

    //Generar
    tcab.appendChild(titulos);
    tfot.appendChild(piespag);
    tab1.appendChild(tcab);
    tab1.appendChild(tbod);
    tab1.appendChild(tfot);
    tab1.setAttribute("class", "table table-bordered");
    tab1.setAttribute("width", "100%");
    tab1.setAttribute("cellspacing", "0");

    //Desbloquear interfaz
    if (opc1 != 1) { document.getElementById("Fechao").disabled = false; }
    document.getElementById("dias").disabled = false;
    document.getElementById("CC").disabled = false;
    document.getElementById("PMP").disabled = false;
    document.getElementById("DA").disabled = false;
    document.getElementById("Kco").disabled = false;
    document.getElementById("Kcm").disabled = false;
    document.getElementById("Kcf").disabled = false;
    document.getElementById("Fa1").disabled = false;
    document.getElementById("dias").disabled = false;
}

function Exportarcsv(filename) {
    var csv = [" "];
    var rows = document.querySelectorAll("#tab_reporte tr");
    for (var i = 0; i < rows.length; i++) {
        var row = [],
            cols = rows[i].querySelectorAll("#tab_reporte th, #tab_reporte td");
        for (var j = 0; j < cols.length; j++) {
            //unir contenido de las filas
            row.push(cols[j].innerText);
        }
        //poner en el arreglo de salida
        csv.push([row]);
        csv.push(["\n"]);
    }
    //Función para descargar el archivo en formato csv 
    DescargaCSV(csv, filename);
}

function DescargaCSV(csv, nombrearchivo) {
    var csvFile;
    var downloadLink;
    // Crear objeto blob csv
    csvFile = new Blob([csv], { type: "text/csv" });
    // Crear link de descarga
    downloadLink = document.createElement("a");
    // Asignar link de descarga
    downloadLink.download = nombrearchivo;
    // Crear link al archivo
    downloadLink.href = window.URL.createObjectURL(csvFile);
    // Ocultar link
    downloadLink.style.display = "none";
    // Agregar link de descarga
    document.body.appendChild(downloadLink);
    // Ejecutar función
    downloadLink.click();
}

function archivojson() {
    const json = [{
            "Fecha": "3/02/2021",
            "dds": 12,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.728812845,
            "Eto_Calc_mm_d-1": 3.785405265,
            "SWC_1_Calib_2(%)": 22.96338198,
            "SWC_2_Calib_2(%)": 35.80787658,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "4/02/2021",
            "dds": 13,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.316460775,
            "Eto_Calc_mm_d-1": 2.506772743,
            "SWC_1_Calib_2(%)": 23.0096877,
            "SWC_2_Calib_2(%)": 35.62094995,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "5/02/2021",
            "dds": 14,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 1.504795872,
            "Eto_Calc_mm_d-1": 2.33393387,
            "SWC_1_Calib_2(%)": 23.19039543,
            "SWC_2_Calib_2(%)": 35.50054057,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "6/02/2021",
            "dds": 15,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.5444689,
            "Eto_Calc_mm_d-1": 3.265649405,
            "SWC_1_Calib_2(%)": 23.21509016,
            "SWC_2_Calib_2(%)": 35.49911432,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "7/02/2021",
            "dds": 16,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.698112562,
            "Eto_Calc_mm_d-1": 2.224406373,
            "SWC_1_Calib_2(%)": 23.11838572,
            "SWC_2_Calib_2(%)": 35.51519495,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "8/02/2021",
            "dds": 17,
            "Precipitacion (mm)": 0,
            "Riego": 25.5,
            "Etc_mm_d-1": 1.579470581,
            "Eto_Calc_mm_d-1": 2.649746204,
            "SWC_1_Calib_2(%)": 23.09639344,
            "SWC_2_Calib_2(%)": 35.46883859,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "9/02/2021",
            "dds": 18,
            "Precipitacion (mm)": 17,
            "Riego": 0,
            "Etc_mm_d-1": 2.116689987,
            "Eto_Calc_mm_d-1": 2.515363245,
            "SWC_1_Calib_2(%)": 27.95694479,
            "SWC_2_Calib_2(%)": 35.23802094,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "10/02/2021",
            "dds": 19,
            "Precipitacion (mm)": 5,
            "Riego": 0,
            "Etc_mm_d-1": 3.035103828,
            "Eto_Calc_mm_d-1": 3.749585171,
            "SWC_1_Calib_2(%)": 37.22979033,
            "SWC_2_Calib_2(%)": 35.91857269,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "11/02/2021",
            "dds": 20,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 3.367390412,
            "Eto_Calc_mm_d-1": 4.095879965,
            "SWC_1_Calib_2(%)": 34.64957996,
            "SWC_2_Calib_2(%)": 37.66405348,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "12/02/2021",
            "dds": 21,
            "Precipitacion (mm)": 4,
            "Riego": 0,
            "Etc_mm_d-1": 1.656290806,
            "Eto_Calc_mm_d-1": 1.763855536,
            "SWC_1_Calib_2(%)": 31.80820215,
            "SWC_2_Calib_2(%)": 38.21591249,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "13/02/2021",
            "dds": 22,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.606655452,
            "Eto_Calc_mm_d-1": 2.661142188,
            "SWC_1_Calib_2(%)": 31.93967503,
            "SWC_2_Calib_2(%)": 38.27870707,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "14/02/2021",
            "dds": 23,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.694392901,
            "Eto_Calc_mm_d-1": 3.70136195,
            "SWC_1_Calib_2(%)": 30.98135912,
            "SWC_2_Calib_2(%)": 38.36068012,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "15/02/2021",
            "dds": 24,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 1.805360875,
            "Eto_Calc_mm_d-1": 1.710237986,
            "SWC_1_Calib_2(%)": 29.7322702,
            "SWC_2_Calib_2(%)": 38.32455997,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "16/02/2021",
            "dds": 25,
            "Precipitacion (mm)": 3,
            "Riego": 0,
            "Etc_mm_d-1": 2.737464785,
            "Eto_Calc_mm_d-1": 3.865922969,
            "SWC_1_Calib_2(%)": 29.40652483,
            "SWC_2_Calib_2(%)": 38.18055031,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "17/02/2021",
            "dds": 26,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.84958387,
            "Eto_Calc_mm_d-1": 3.876706885,
            "SWC_1_Calib_2(%)": 29.00278098,
            "SWC_2_Calib_2(%)": 38.05611687,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "18/02/2021",
            "dds": 27,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 2.306886678,
            "Eto_Calc_mm_d-1": 3.451002412,
            "SWC_1_Calib_2(%)": 28.19787065,
            "SWC_2_Calib_2(%)": 37.94810342,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "19/02/2021",
            "dds": 28,
            "Precipitacion (mm)": 8,
            "Riego": 0,
            "Etc_mm_d-1": 1.98487621,
            "Eto_Calc_mm_d-1": 2.314458269,
            "SWC_1_Calib_2(%)": 27.95460788,
            "SWC_2_Calib_2(%)": 37.74161963,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "20/02/2021",
            "dds": 29,
            "Precipitacion (mm)": 9,
            "Riego": 25.5,
            "Etc_mm_d-1": 2.162464477,
            "Eto_Calc_mm_d-1": 3.423081578,
            "SWC_1_Calib_2(%)": 40.47998127,
            "SWC_2_Calib_2(%)": 41.68877393,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "21/02/2021",
            "dds": 30,
            "Precipitacion (mm)": 4,
            "Riego": 0,
            "Etc_mm_d-1": 1.943589108,
            "Eto_Calc_mm_d-1": 2.475305392,
            "SWC_1_Calib_2(%)": 39.70517591,
            "SWC_2_Calib_2(%)": 43.27220533,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "22/02/2021",
            "dds": 31,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.226859298,
            "Eto_Calc_mm_d-1": 1.227662605,
            "SWC_1_Calib_2(%)": 38.29252071,
            "SWC_2_Calib_2(%)": 43.28653899,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "23/02/2021",
            "dds": 32,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.163560812,
            "Eto_Calc_mm_d-1": 2.404708096,
            "SWC_1_Calib_2(%)": 37.14903948,
            "SWC_2_Calib_2(%)": 43.31874625,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "24/02/2021",
            "dds": 33,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.445496368,
            "Eto_Calc_mm_d-1": 3.228460824,
            "SWC_1_Calib_2(%)": 35.85205451,
            "SWC_2_Calib_2(%)": 43.32622716,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "25/02/2021",
            "dds": 34,
            "Precipitacion (mm)": 9,
            "Riego": 0,
            "Etc_mm_d-1": 1.425420563,
            "Eto_Calc_mm_d-1": 0.73551258,
            "SWC_1_Calib_2(%)": 39.17325153,
            "SWC_2_Calib_2(%)": 46.13099607,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "26/02/2021",
            "dds": 35,
            "Precipitacion (mm)": 3,
            "Riego": 0,
            "Etc_mm_d-1": 2.583684738,
            "Eto_Calc_mm_d-1": 3.017686793,
            "SWC_1_Calib_2(%)": 40.86736313,
            "SWC_2_Calib_2(%)": 44.75555138,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "27/02/2021",
            "dds": 36,
            "Precipitacion (mm)": 7,
            "Riego": 0,
            "Etc_mm_d-1": 1.87027045,
            "Eto_Calc_mm_d-1": 1.90214325,
            "SWC_1_Calib_2(%)": 40.43260007,
            "SWC_2_Calib_2(%)": 43.65246929,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "28/02/2021",
            "dds": 37,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.531639062,
            "Eto_Calc_mm_d-1": 3.150779204,
            "SWC_1_Calib_2(%)": 40.10002062,
            "SWC_2_Calib_2(%)": 43.38376056,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "1/03/2021",
            "dds": 38,
            "Precipitacion (mm)": 4,
            "Riego": 0,
            "Etc_mm_d-1": 2.824393456,
            "Eto_Calc_mm_d-1": 3.691123381,
            "SWC_1_Calib_2(%)": 38.71663484,
            "SWC_2_Calib_2(%)": 43.19765288,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "2/03/2021",
            "dds": 39,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 1.692465975,
            "Eto_Calc_mm_d-1": 2.053407756,
            "SWC_1_Calib_2(%)": 39.21494925,
            "SWC_2_Calib_2(%)": 43.19959867,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "3/03/2021",
            "dds": 40,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.067953397,
            "Eto_Calc_mm_d-1": 2.401415356,
            "SWC_1_Calib_2(%)": 38.0699557,
            "SWC_2_Calib_2(%)": 43.23715344,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "4/03/2021",
            "dds": 41,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.292420008,
            "Eto_Calc_mm_d-1": 1.192058933,
            "SWC_1_Calib_2(%)": 37.86949354,
            "SWC_2_Calib_2(%)": 43.26792657,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "5/03/2021",
            "dds": 42,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.512488129,
            "Eto_Calc_mm_d-1": 1.504618129,
            "SWC_1_Calib_2(%)": 38.17189258,
            "SWC_2_Calib_2(%)": 43.27316929,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "6/03/2021",
            "dds": 43,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.957069208,
            "Eto_Calc_mm_d-1": 2.384515246,
            "SWC_1_Calib_2(%)": 37.47495335,
            "SWC_2_Calib_2(%)": 43.29532078,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "7/03/2021",
            "dds": 44,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.484744196,
            "Eto_Calc_mm_d-1": 1.662354654,
            "SWC_1_Calib_2(%)": 36.46564758,
            "SWC_2_Calib_2(%)": 43.32092896,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "8/03/2021",
            "dds": 45,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.23993803,
            "Eto_Calc_mm_d-1": 2.99030496,
            "SWC_1_Calib_2(%)": 35.63172543,
            "SWC_2_Calib_2(%)": 43.32331198,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "9/03/2021",
            "dds": 46,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.252573166,
            "Eto_Calc_mm_d-1": 3.695308643,
            "SWC_1_Calib_2(%)": 34.32072792,
            "SWC_2_Calib_2(%)": 43.2733058,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "10/03/2021",
            "dds": 47,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.524537976,
            "Eto_Calc_mm_d-1": 1.719471391,
            "SWC_1_Calib_2(%)": 33.15812539,
            "SWC_2_Calib_2(%)": 43.15602745,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "11/03/2021",
            "dds": 48,
            "Precipitacion (mm)": 7,
            "Riego": 0,
            "Etc_mm_d-1": 1.639538739,
            "Eto_Calc_mm_d-1": 2.160160672,
            "SWC_1_Calib_2(%)": 33.17241784,
            "SWC_2_Calib_2(%)": 43.00177711,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "12/03/2021",
            "dds": 49,
            "Precipitacion (mm)": 15,
            "Riego": 0,
            "Etc_mm_d-1": 2.043086831,
            "Eto_Calc_mm_d-1": 2.866031375,
            "SWC_1_Calib_2(%)": 39.0469712,
            "SWC_2_Calib_2(%)": 43.17056226,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "13/03/2021",
            "dds": 50,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.836126913,
            "Eto_Calc_mm_d-1": 2.600994931,
            "SWC_1_Calib_2(%)": 40.2218136,
            "SWC_2_Calib_2(%)": 43.22891966,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "14/03/2021",
            "dds": 51,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 1.610833744,
            "Eto_Calc_mm_d-1": 1.864997631,
            "SWC_1_Calib_2(%)": 39.06693655,
            "SWC_2_Calib_2(%)": 43.2659188,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "15/03/2021",
            "dds": 52,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.187906013,
            "Eto_Calc_mm_d-1": 0.708717171,
            "SWC_1_Calib_2(%)": 39.38721709,
            "SWC_2_Calib_2(%)": 43.27776633,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "16/03/2021",
            "dds": 53,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 1.929330006,
            "Eto_Calc_mm_d-1": 2.364475351,
            "SWC_1_Calib_2(%)": 40.52529431,
            "SWC_2_Calib_2(%)": 43.22470788,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "17/03/2021",
            "dds": 54,
            "Precipitacion (mm)": 6,
            "Riego": 0,
            "Etc_mm_d-1": 1.754066759,
            "Eto_Calc_mm_d-1": 1.974063635,
            "SWC_1_Calib_2(%)": 39.29275043,
            "SWC_2_Calib_2(%)": 43.27011275,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "18/03/2021",
            "dds": 55,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 1.159001797,
            "Eto_Calc_mm_d-1": 0.897291422,
            "SWC_1_Calib_2(%)": 39.4121201,
            "SWC_2_Calib_2(%)": 43.29221081,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "19/03/2021",
            "dds": 56,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 2.297337748,
            "Eto_Calc_mm_d-1": 3.459437696,
            "SWC_1_Calib_2(%)": 38.88437681,
            "SWC_2_Calib_2(%)": 43.31104716,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "20/03/2021",
            "dds": 57,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 2.47058394,
            "Eto_Calc_mm_d-1": 3.668347373,
            "SWC_1_Calib_2(%)": 37.73106275,
            "SWC_2_Calib_2(%)": 43.30132949,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "21/03/2021",
            "dds": 58,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.581142316,
            "Eto_Calc_mm_d-1": 1.88006052,
            "SWC_1_Calib_2(%)": 36.2966622,
            "SWC_2_Calib_2(%)": 43.17034638,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "22/03/2021",
            "dds": 59,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.707831903,
            "Eto_Calc_mm_d-1": 2.356287483,
            "SWC_1_Calib_2(%)": 34.9781161,
            "SWC_2_Calib_2(%)": 42.86721419,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "23/03/2021",
            "dds": 60,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.403264265,
            "Eto_Calc_mm_d-1": 1.982596378,
            "SWC_1_Calib_2(%)": 33.60409981,
            "SWC_2_Calib_2(%)": 42.43971709,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "24/03/2021",
            "dds": 61,
            "Precipitacion (mm)": 9,
            "Riego": 0,
            "Etc_mm_d-1": 1.054922713,
            "Eto_Calc_mm_d-1": 1.019252998,
            "SWC_1_Calib_2(%)": 34.49243457,
            "SWC_2_Calib_2(%)": 42.32294851,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "25/03/2021",
            "dds": 62,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.718530292,
            "Eto_Calc_mm_d-1": 2.152727934,
            "SWC_1_Calib_2(%)": 37.61633216,
            "SWC_2_Calib_2(%)": 43.02555938,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "26/03/2021",
            "dds": 63,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.46203576,
            "Eto_Calc_mm_d-1": 1.858425677,
            "SWC_1_Calib_2(%)": 36.33660666,
            "SWC_2_Calib_2(%)": 42.91539074,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "27/03/2021",
            "dds": 64,
            "Precipitacion (mm)": 3,
            "Riego": 0,
            "Etc_mm_d-1": 1.110448493,
            "Eto_Calc_mm_d-1": 0.815400966,
            "SWC_1_Calib_2(%)": 36.67848168,
            "SWC_2_Calib_2(%)": 42.7987486,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "28/03/2021",
            "dds": 65,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.071893426,
            "Eto_Calc_mm_d-1": 3.412649463,
            "SWC_1_Calib_2(%)": 37.38620376,
            "SWC_2_Calib_2(%)": 42.73340053,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "29/03/2021",
            "dds": 66,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.736437447,
            "Eto_Calc_mm_d-1": 1.483930872,
            "SWC_1_Calib_2(%)": 36.26151023,
            "SWC_2_Calib_2(%)": 42.53750824,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "30/03/2021",
            "dds": 67,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.682804783,
            "Eto_Calc_mm_d-1": 2.058488334,
            "SWC_1_Calib_2(%)": 35.45492411,
            "SWC_2_Calib_2(%)": 42.25045196,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "31/03/2021",
            "dds": 68,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.89740204,
            "Eto_Calc_mm_d-1": 2.571399123,
            "SWC_1_Calib_2(%)": 34.24103917,
            "SWC_2_Calib_2(%)": 41.79306595,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "1/04/2021",
            "dds": 69,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.993519343,
            "Eto_Calc_mm_d-1": 2.595194443,
            "SWC_1_Calib_2(%)": 32.74689583,
            "SWC_2_Calib_2(%)": 41.09584056,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "2/04/2021",
            "dds": 70,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.422545926,
            "Eto_Calc_mm_d-1": 1.731112409,
            "SWC_1_Calib_2(%)": 31.59414171,
            "SWC_2_Calib_2(%)": 40.3659711,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "3/04/2021",
            "dds": 71,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 1.226961074,
            "Eto_Calc_mm_d-1": 1.165441944,
            "SWC_1_Calib_2(%)": 32.07794949,
            "SWC_2_Calib_2(%)": 39.9150851,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "4/04/2021",
            "dds": 72,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.955587252,
            "Eto_Calc_mm_d-1": 2.356069958,
            "SWC_1_Calib_2(%)": 32.09919695,
            "SWC_2_Calib_2(%)": 39.65537952,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "5/04/2021",
            "dds": 73,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.973314194,
            "Eto_Calc_mm_d-1": 2.245239083,
            "SWC_1_Calib_2(%)": 31.43826988,
            "SWC_2_Calib_2(%)": 39.32345166,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "6/04/2021",
            "dds": 74,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.131598189,
            "Eto_Calc_mm_d-1": 2.24456973,
            "SWC_1_Calib_2(%)": 30.34715744,
            "SWC_2_Calib_2(%)": 38.94628193,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "7/04/2021",
            "dds": 75,
            "Precipitacion (mm)": 4,
            "Riego": 25.5,
            "Etc_mm_d-1": 1.670814737,
            "Eto_Calc_mm_d-1": 1.12910059,
            "SWC_1_Calib_2(%)": 37.12220487,
            "SWC_2_Calib_2(%)": 39.78607973,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "8/04/2021",
            "dds": 76,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.82044043,
            "Eto_Calc_mm_d-1": 2.010346446,
            "SWC_1_Calib_2(%)": 43.24525466,
            "SWC_2_Calib_2(%)": 43.54676453,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "9/04/2021",
            "dds": 77,
            "Precipitacion (mm)": 6,
            "Riego": 0,
            "Etc_mm_d-1": 1.513999237,
            "Eto_Calc_mm_d-1": 0.96824322,
            "SWC_1_Calib_2(%)": 43.17793268,
            "SWC_2_Calib_2(%)": 43.24780678,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "10/04/2021",
            "dds": 78,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.438899633,
            "Eto_Calc_mm_d-1": 3.236807446,
            "SWC_1_Calib_2(%)": 42.82943316,
            "SWC_2_Calib_2(%)": 43.32042218,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "11/04/2021",
            "dds": 79,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.767469587,
            "Eto_Calc_mm_d-1": 3.457293896,
            "SWC_1_Calib_2(%)": 42.40913433,
            "SWC_2_Calib_2(%)": 43.28137758,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "12/04/2021",
            "dds": 80,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.272624581,
            "Eto_Calc_mm_d-1": 0.46648583,
            "SWC_1_Calib_2(%)": 42.17822311,
            "SWC_2_Calib_2(%)": 43.23443525,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "13/04/2021",
            "dds": 81,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.738148692,
            "Eto_Calc_mm_d-1": 3.589773926,
            "SWC_1_Calib_2(%)": 41.97788759,
            "SWC_2_Calib_2(%)": 43.15406546,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "14/04/2021",
            "dds": 82,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.794852491,
            "Eto_Calc_mm_d-1": 1.973558073,
            "SWC_1_Calib_2(%)": 41.43880578,
            "SWC_2_Calib_2(%)": 42.98330417,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "15/04/2021",
            "dds": 83,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.234728931,
            "Eto_Calc_mm_d-1": 2.442553484,
            "SWC_1_Calib_2(%)": 40.80305833,
            "SWC_2_Calib_2(%)": 42.6959245,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "16/04/2021",
            "dds": 84,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.075792969,
            "Eto_Calc_mm_d-1": 2.463520341,
            "SWC_1_Calib_2(%)": 40.03650996,
            "SWC_2_Calib_2(%)": 42.35068639,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "17/04/2021",
            "dds": 85,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 2.243110136,
            "Eto_Calc_mm_d-1": 2.727655108,
            "SWC_1_Calib_2(%)": 39.86407471,
            "SWC_2_Calib_2(%)": 42.01432936,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "18/04/2021",
            "dds": 86,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.071668143,
            "Eto_Calc_mm_d-1": 2.52000005,
            "SWC_1_Calib_2(%)": 39.2583803,
            "SWC_2_Calib_2(%)": 41.71305193,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "19/04/2021",
            "dds": 87,
            "Precipitacion (mm)": 1,
            "Riego": 17,
            "Etc_mm_d-1": 3.227621447,
            "Eto_Calc_mm_d-1": 3.758321068,
            "SWC_1_Calib_2(%)": 39.96999854,
            "SWC_2_Calib_2(%)": 41.48247461,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "20/04/2021",
            "dds": 88,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 3.088034188,
            "Eto_Calc_mm_d-1": 4.248831149,
            "SWC_1_Calib_2(%)": 42.54008215,
            "SWC_2_Calib_2(%)": 43.20397373,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "21/04/2021",
            "dds": 89,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.344659272,
            "Eto_Calc_mm_d-1": 2.799773041,
            "SWC_1_Calib_2(%)": 41.65518708,
            "SWC_2_Calib_2(%)": 43.07938465,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "22/04/2021",
            "dds": 90,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.917036826,
            "Eto_Calc_mm_d-1": 3.961866013,
            "SWC_1_Calib_2(%)": 40.85932369,
            "SWC_2_Calib_2(%)": 42.80641358,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "23/04/2021",
            "dds": 91,
            "Precipitacion (mm)": 2,
            "Riego": 17,
            "Etc_mm_d-1": 2.860889565,
            "Eto_Calc_mm_d-1": 3.715881239,
            "SWC_1_Calib_2(%)": 42.71994762,
            "SWC_2_Calib_2(%)": 43.17400554,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "24/04/2021",
            "dds": 92,
            "Precipitacion (mm)": 4,
            "Riego": 0,
            "Etc_mm_d-1": 2.61132209,
            "Eto_Calc_mm_d-1": 3.607614006,
            "SWC_1_Calib_2(%)": 42.30828532,
            "SWC_2_Calib_2(%)": 43.28455107,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "25/04/2021",
            "dds": 93,
            "Precipitacion (mm)": 6,
            "Riego": 0,
            "Etc_mm_d-1": 1.728992963,
            "Eto_Calc_mm_d-1": 1.654626533,
            "SWC_1_Calib_2(%)": 42.89107943,
            "SWC_2_Calib_2(%)": 43.32315097,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "26/04/2021",
            "dds": 94,
            "Precipitacion (mm)": 3,
            "Riego": 0,
            "Etc_mm_d-1": 2.135601633,
            "Eto_Calc_mm_d-1": 2.70946681,
            "SWC_1_Calib_2(%)": 42.47393156,
            "SWC_2_Calib_2(%)": 43.31166155,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "27/04/2021",
            "dds": 95,
            "Precipitacion (mm)": 6,
            "Riego": 0,
            "Etc_mm_d-1": 1.21392885,
            "Eto_Calc_mm_d-1": 1.228789157,
            "SWC_1_Calib_2(%)": 42.35980995,
            "SWC_2_Calib_2(%)": 43.28875515,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "28/04/2021",
            "dds": 96,
            "Precipitacion (mm)": 8,
            "Riego": 0,
            "Etc_mm_d-1": 1.203022629,
            "Eto_Calc_mm_d-1": 1.601511627,
            "SWC_1_Calib_2(%)": 42.83763532,
            "SWC_2_Calib_2(%)": 43.31614635,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "29/04/2021",
            "dds": 97,
            "Precipitacion (mm)": 9,
            "Riego": 0,
            "Etc_mm_d-1": 1.380384894,
            "Eto_Calc_mm_d-1": 1.628664489,
            "SWC_1_Calib_2(%)": 42.95874085,
            "SWC_2_Calib_2(%)": 43.32157304,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "30/04/2021",
            "dds": 98,
            "Precipitacion (mm)": 5,
            "Riego": 0,
            "Etc_mm_d-1": 0.973813245,
            "Eto_Calc_mm_d-1": 0.416630449,
            "SWC_1_Calib_2(%)": 43.13851644,
            "SWC_2_Calib_2(%)": 43.28325554,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "1/05/2021",
            "dds": 99,
            "Precipitacion (mm)": 4,
            "Riego": 0,
            "Etc_mm_d-1": 1.633079965,
            "Eto_Calc_mm_d-1": 1.931901026,
            "SWC_1_Calib_2(%)": 42.837315,
            "SWC_2_Calib_2(%)": 43.32156581,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "2/05/2021",
            "dds": 100,
            "Precipitacion (mm)": 7,
            "Riego": 0,
            "Etc_mm_d-1": 1.898693403,
            "Eto_Calc_mm_d-1": 2.562675809,
            "SWC_1_Calib_2(%)": 42.80559215,
            "SWC_2_Calib_2(%)": 43.32437423,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "3/05/2021",
            "dds": 101,
            "Precipitacion (mm)": 3,
            "Riego": 0,
            "Etc_mm_d-1": 2.322593296,
            "Eto_Calc_mm_d-1": 3.157818068,
            "SWC_1_Calib_2(%)": 42.93701202,
            "SWC_2_Calib_2(%)": 43.31967823,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "4/05/2021",
            "dds": 102,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.834101422,
            "Eto_Calc_mm_d-1": 2.384194214,
            "SWC_1_Calib_2(%)": 42.82285493,
            "SWC_2_Calib_2(%)": 43.32466785,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "5/05/2021",
            "dds": 103,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 2.18717592,
            "Eto_Calc_mm_d-1": 3.129801946,
            "SWC_1_Calib_2(%)": 42.50844368,
            "SWC_2_Calib_2(%)": 43.3178332,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "6/05/2021",
            "dds": 104,
            "Precipitacion (mm)": 6,
            "Riego": 0,
            "Etc_mm_d-1": 1.959776779,
            "Eto_Calc_mm_d-1": 2.403925107,
            "SWC_1_Calib_2(%)": 42.27104108,
            "SWC_2_Calib_2(%)": 43.27818978,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "7/05/2021",
            "dds": 105,
            "Precipitacion (mm)": 3,
            "Riego": 0,
            "Etc_mm_d-1": 2.575214881,
            "Eto_Calc_mm_d-1": 3.645315597,
            "SWC_1_Calib_2(%)": 42.64002684,
            "SWC_2_Calib_2(%)": 43.31142608,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "8/05/2021",
            "dds": 106,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.093816457,
            "Eto_Calc_mm_d-1": 1.185324647,
            "SWC_1_Calib_2(%)": 42.72118906,
            "SWC_2_Calib_2(%)": 43.31758153,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "9/05/2021",
            "dds": 107,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 1.834181618,
            "Eto_Calc_mm_d-1": 2.120150505,
            "SWC_1_Calib_2(%)": 42.59061285,
            "SWC_2_Calib_2(%)": 43.30876657,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "10/05/2021",
            "dds": 108,
            "Precipitacion (mm)": 5,
            "Riego": 0,
            "Etc_mm_d-1": 2.060016629,
            "Eto_Calc_mm_d-1": 2.20119799,
            "SWC_1_Calib_2(%)": 42.87750756,
            "SWC_2_Calib_2(%)": 43.32143432,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "11/05/2021",
            "dds": 109,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 2.441296794,
            "Eto_Calc_mm_d-1": 3.0085499,
            "SWC_1_Calib_2(%)": 42.44056454,
            "SWC_2_Calib_2(%)": 43.30191104,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "12/05/2021",
            "dds": 110,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.310120324,
            "Eto_Calc_mm_d-1": 2.524640634,
            "SWC_1_Calib_2(%)": 42.12013375,
            "SWC_2_Calib_2(%)": 43.27317421,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "13/05/2021",
            "dds": 111,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.022611693,
            "Eto_Calc_mm_d-1": 2.145179336,
            "SWC_1_Calib_2(%)": 41.51730415,
            "SWC_2_Calib_2(%)": 43.19903132,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "14/05/2021",
            "dds": 112,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.215119449,
            "Eto_Calc_mm_d-1": 2.848683407,
            "SWC_1_Calib_2(%)": 40.96750457,
            "SWC_2_Calib_2(%)": 43.06053138,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "15/05/2021",
            "dds": 113,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.75142087,
            "Eto_Calc_mm_d-1": 1.742348468,
            "SWC_1_Calib_2(%)": 40.44589165,
            "SWC_2_Calib_2(%)": 42.91371401,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "16/05/2021",
            "dds": 114,
            "Precipitacion (mm)": 22,
            "Riego": 0,
            "Etc_mm_d-1": 1.633831337,
            "Eto_Calc_mm_d-1": 1.925201998,
            "SWC_1_Calib_2(%)": 41.11718394,
            "SWC_2_Calib_2(%)": 42.94703371,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "17/05/2021",
            "dds": 115,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.314090615,
            "Eto_Calc_mm_d-1": 1.128360983,
            "SWC_1_Calib_2(%)": 42.76858873,
            "SWC_2_Calib_2(%)": 43.3275762,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "18/05/2021",
            "dds": 116,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.028364423,
            "Eto_Calc_mm_d-1": 2.256266206,
            "SWC_1_Calib_2(%)": 42.69083678,
            "SWC_2_Calib_2(%)": 43.32104423,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "19/05/2021",
            "dds": 117,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 3.002941,
            "Eto_Calc_mm_d-1": 3.946982199,
            "SWC_1_Calib_2(%)": 42.13953509,
            "SWC_2_Calib_2(%)": 43.26714473,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "20/05/2021",
            "dds": 118,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.379526893,
            "Eto_Calc_mm_d-1": 2.79583219,
            "SWC_1_Calib_2(%)": 41.43094203,
            "SWC_2_Calib_2(%)": 43.15145407,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "21/05/2021",
            "dds": 119,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.027137005,
            "Eto_Calc_mm_d-1": 2.180719543,
            "SWC_1_Calib_2(%)": 40.79559014,
            "SWC_2_Calib_2(%)": 42.99059585,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "22/05/2021",
            "dds": 120,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.9294461,
            "Eto_Calc_mm_d-1": 2.070044394,
            "SWC_1_Calib_2(%)": 40.23884523,
            "SWC_2_Calib_2(%)": 42.79696832,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "23/05/2021",
            "dds": 121,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.660628699,
            "Eto_Calc_mm_d-1": 3.418413303,
            "SWC_1_Calib_2(%)": 39.52584104,
            "SWC_2_Calib_2(%)": 42.49442034,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "24/05/2021",
            "dds": 122,
            "Precipitacion (mm)": 3,
            "Riego": 0,
            "Etc_mm_d-1": 1.819991736,
            "Eto_Calc_mm_d-1": 0.903737633,
            "SWC_1_Calib_2(%)": 39.06839694,
            "SWC_2_Calib_2(%)": 42.2363866,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "25/05/2021",
            "dds": 123,
            "Precipitacion (mm)": 4,
            "Riego": 0,
            "Etc_mm_d-1": 2.422923462,
            "Eto_Calc_mm_d-1": 1.779011623,
            "SWC_1_Calib_2(%)": 41.08901367,
            "SWC_2_Calib_2(%)": 42.44963993,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "26/05/2021",
            "dds": 124,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.557888657,
            "Eto_Calc_mm_d-1": 3.562008428,
            "SWC_1_Calib_2(%)": 42.62569193,
            "SWC_2_Calib_2(%)": 43.30729514,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "27/05/2021",
            "dds": 125,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 1.447768019,
            "Eto_Calc_mm_d-1": 0.830295213,
            "SWC_1_Calib_2(%)": 42.1792269,
            "SWC_2_Calib_2(%)": 43.27538689,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "28/05/2021",
            "dds": 126,
            "Precipitacion (mm)": 10,
            "Riego": 0,
            "Etc_mm_d-1": 1.672922981,
            "Eto_Calc_mm_d-1": 1.982009492,
            "SWC_1_Calib_2(%)": 42.11031047,
            "SWC_2_Calib_2(%)": 43.25101989,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "29/05/2021",
            "dds": 127,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.912910871,
            "Eto_Calc_mm_d-1": 2.065201896,
            "SWC_1_Calib_2(%)": 42.90256807,
            "SWC_2_Calib_2(%)": 43.32698186,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "30/05/2021",
            "dds": 128,
            "Precipitacion (mm)": 8,
            "Riego": 0,
            "Etc_mm_d-1": 1.43793393,
            "Eto_Calc_mm_d-1": 1.348869673,
            "SWC_1_Calib_2(%)": 42.82946894,
            "SWC_2_Calib_2(%)": 43.32188356,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "31/05/2021",
            "dds": 129,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.160262411,
            "Eto_Calc_mm_d-1": 2.475843236,
            "SWC_1_Calib_2(%)": 42.7827386,
            "SWC_2_Calib_2(%)": 43.32219996,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "1/06/2021",
            "dds": 130,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 2.054288018,
            "Eto_Calc_mm_d-1": 2.440980667,
            "SWC_1_Calib_2(%)": 42.2535499,
            "SWC_2_Calib_2(%)": 43.31330546,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "2/06/2021",
            "dds": 131,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 2.039274323,
            "Eto_Calc_mm_d-1": 2.55750033,
            "SWC_1_Calib_2(%)": 42.01972997,
            "SWC_2_Calib_2(%)": 43.28830272,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "3/06/2021",
            "dds": 132,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 2.185715256,
            "Eto_Calc_mm_d-1": 2.409129581,
            "SWC_1_Calib_2(%)": 41.5797928,
            "SWC_2_Calib_2(%)": 43.24029572,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "4/06/2021",
            "dds": 133,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.996348833,
            "Eto_Calc_mm_d-1": 2.197057454,
            "SWC_1_Calib_2(%)": 40.79749612,
            "SWC_2_Calib_2(%)": 43.13798173,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "5/06/2021",
            "dds": 134,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 2.181468529,
            "Eto_Calc_mm_d-1": 2.808140709,
            "SWC_1_Calib_2(%)": 39.85807014,
            "SWC_2_Calib_2(%)": 42.955377,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "6/06/2021",
            "dds": 135,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 1.866899338,
            "Eto_Calc_mm_d-1": 1.339651808,
            "SWC_1_Calib_2(%)": 39.24735674,
            "SWC_2_Calib_2(%)": 42.73100291,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "7/06/2021",
            "dds": 136,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.913035041,
            "Eto_Calc_mm_d-1": 2.03314029,
            "SWC_1_Calib_2(%)": 38.846089,
            "SWC_2_Calib_2(%)": 42.52876,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "8/06/2021",
            "dds": 137,
            "Precipitacion (mm)": 5,
            "Riego": 0,
            "Etc_mm_d-1": 1.407091828,
            "Eto_Calc_mm_d-1": 1.250270847,
            "SWC_1_Calib_2(%)": 38.60865205,
            "SWC_2_Calib_2(%)": 42.3036816,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "9/06/2021",
            "dds": 138,
            "Precipitacion (mm)": 12,
            "Riego": 0,
            "Etc_mm_d-1": 1.401109516,
            "Eto_Calc_mm_d-1": 0.817771942,
            "SWC_1_Calib_2(%)": 40.53637852,
            "SWC_2_Calib_2(%)": 42.31076644,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "10/06/2021",
            "dds": 139,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.577269581,
            "Eto_Calc_mm_d-1": 1.542992975,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "11/06/2021",
            "dds": 140,
            "Precipitacion (mm)": 6,
            "Riego": 0,
            "Etc_mm_d-1": 1.800297271,
            "Eto_Calc_mm_d-1": 2.323196832,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "12/06/2021",
            "dds": 141,
            "Precipitacion (mm)": 21,
            "Riego": 0,
            "Etc_mm_d-1": 2.385403871,
            "Eto_Calc_mm_d-1": 3.641371909,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "13/06/2021",
            "dds": 142,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.499400204,
            "Eto_Calc_mm_d-1": 1.657509587,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "14/06/2021",
            "dds": 143,
            "Precipitacion (mm)": 7,
            "Riego": 0,
            "Etc_mm_d-1": 1.354806492,
            "Eto_Calc_mm_d-1": 0.781408381,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "15/06/2021",
            "dds": 144,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 2.116834627,
            "Eto_Calc_mm_d-1": 2.953851537,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "16/06/2021",
            "dds": 145,
            "Precipitacion (mm)": 1,
            "Riego": 0,
            "Etc_mm_d-1": 2.163147666,
            "Eto_Calc_mm_d-1": 3.063477492,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "17/06/2021",
            "dds": 146,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.910235823,
            "Eto_Calc_mm_d-1": 2.159727892,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "18/06/2021",
            "dds": 147,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.889734361,
            "Eto_Calc_mm_d-1": 2.312079943,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "19/06/2021",
            "dds": 148,
            "Precipitacion (mm)": 3,
            "Riego": 0,
            "Etc_mm_d-1": 2.010890086,
            "Eto_Calc_mm_d-1": 2.634624477,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "20/06/2021",
            "dds": 149,
            "Precipitacion (mm)": 11,
            "Riego": 0,
            "Etc_mm_d-1": 1.457619364,
            "Eto_Calc_mm_d-1": 0.686709238,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "21/06/2021",
            "dds": 150,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.621454191,
            "Eto_Calc_mm_d-1": 1.834133187,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "22/06/2021",
            "dds": 151,
            "Precipitacion (mm)": 2,
            "Riego": 0,
            "Etc_mm_d-1": 1.576987796,
            "Eto_Calc_mm_d-1": 1.777307457,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "23/06/2021",
            "dds": 152,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.638987907,
            "Eto_Calc_mm_d-1": 2.40856521,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 0
        },
        {
            "Fecha": "24/06/2021",
            "dds": 153,
            "Precipitacion (mm)": 7,
            "Riego": 0,
            "Etc_mm_d-1": 1.846422318,
            "Eto_Calc_mm_d-1": 2.341040612,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "25/06/2021",
            "dds": 154,
            "Precipitacion (mm)": 7,
            "Riego": 0,
            "Etc_mm_d-1": 1.638817727,
            "Eto_Calc_mm_d-1": 2.057443661,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 1
        },
        {
            "Fecha": "26/06/2021",
            "dds": 155,
            "Precipitacion (mm)": 0,
            "Riego": 0,
            "Etc_mm_d-1": 1.636385121,
            "Eto_Calc_mm_d-1": 1.970843511,
            "SWC_1_Calib_2(%)": 0,
            "SWC_2_Calib_2(%)": 0,
            "Dias de lluvia": 0
        }
    ]
    return json;
}