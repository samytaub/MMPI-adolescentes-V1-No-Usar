
// Variables Globales

var formulario = document.querySelector("form");
var respuestas = [];
var vr = new Object();
var variablesDeResultado = new Object();
// var respuestas = [];

//Funciones

// Fecha inicial - campo del formulario

function setFecha(){
const fechaInput = document.getElementById('fecha');
const hoy = new Date().toISOString().split('T')[0];
console.log(hoy);
fechaInput.value = hoy;
};

function getTime(){
  // const fechaInput = document.getElementById('fecha');
  // const hora = new Date().toISOString().split('T')[1];  //SOLO HORA
  const hora = new Date().toISOString();
  console.log(hora);
  return hora;
  };


function armaPreguntasHtml(){
// Presenta las preguntas en el Form

    var formulario = document.querySelector("form");
  
    for (var i = 1; i <= preguntas.length; i++) {
  
      var t = document.getElementById("templatepregunta");
      var clone = t.content.cloneNode(true);
  
      clone.getElementById("textoPregunta").innerHTML = preguntas[i-1];
      clone.getElementById("radio1").name = "p"+ i;
      clone.getElementById("radio2").name ="p"+ i;
  
      var tb = document.getElementById("quiz-form");
      tb.appendChild(clone)
    }
  }    

  
 // Llena el array Respuestas

function revisaFormulariodeRespuestas(){
        respuestas = [];
        respuestas.push(document.getElementById("nombreapellido").value);

        console.log("estoy en revisaformularioderespuestas");

        var maxRespuestas = preguntas.length;
        var totalContestadas = 0;

        for (var i = 1; i <= maxRespuestas; i++) {
         
            if (document.querySelector(`input[name="p${i}"]:checked`) === null) {
                   r="nc";
                  respuestas.push(r); }
            else 
            {
                
                  var r = document.querySelector(`input[name="p${i}"]:checked`).value;
                  // console.log("Respuesta #" + i + ": "   + r);
                  respuestas.push(r);

                //   Muestra en el cuadro de control las preguntas que lleva contestadas 
                  totalContestadas++;
                  document.querySelector(".totalcontestadas span ").innerHTML= (totalContestadas + " de " +  maxRespuestas );
                 
                //   Le cambia el color de fondo a cada pregunta con respuesta
                var ck = document.querySelector(`input[name="p${i}"]:checked`);  
                ck.parentElement.parentElement.style.backgroundColor = " rgb(224,250,244) ";
            }
        
        }
// respuestas = respuestasFake;      // <<<<<<< ojo quitarlo luego <<<<<<<<<<<<<<<<<
  //  console.log("respuestas " + respuestas); 




}  //fin de funcion Submit

    


  

function evaluaPlantilla(plantilla,respuestas) {
let c =0;

// console.log(plantilla + "<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>")
plantilla.forEach((p) => {
// contiene la respuesta del paciente para la pregunta p[0] ,
//   p[0] es el primer componente de la plantilla (#de pregunta) en la presente iteracion
    let   respPaciente = respuestas[ p[0] ] ;

// p[1] es el 2do componente de la plantilla ,(v / f ) en la presente iteracion de array de la plantilla    
    let   respEnPlantilla = p[1];
// Si la respuesta del paciente para una pregunta determinada coincide con
//la respuesta que pide la plantilla
    if(respEnPlantilla===respPaciente){c++
        
    console.log("Respuesta " +  p[0]   +  "  "  +  respPaciente + "  ....Plantilla " + p[0] + "   "  + respEnPlantilla + "****");
    }
    else{

    console.log("Respuesta " +  p[0]   +  "  "  +  respPaciente + "  ....Plantilla " + p[0] + "   "  + respEnPlantilla );
    };

  } );    // fin del forEach

return c;
} // Fin de evalua Planilla



function getfactorK(k,tablaFactoresK){
var r = new Object;
tablaFactoresK.forEach(t => {
  if (t[0]===k) {
      r = {factor2k:t[3] , factor4k:t[2] , factor5k:t[1]};    
  }
});
console.log("Valores de facoresK " + r.factor2k + " "   + r.factor4k + " "   + r.factor5k + " "   );
return r;
}
 
// Rutina o funcion Principal

 function mostrarResultados(){
  
  console.log("MostrarResultados");  
  // Valida si se ingreso el nombre 
  nm=document.getElementById("nombreapellido").value;
  if (!nm) {document.getElementById("mensaje").innerHTML="Favor ingresa el nombre";
      return; }
  else  {document.getElementById("mensaje").innerHTML="";   };



// Toggle de las ventanas de Cuestionario y Resultados
//Presenta la ventana de Resulados previo a mostrarlos

if (document.getElementById("screen").classList.contains("visible"))
  {
    document.getElementById("screen").classList.remove("visible");
    document.getElementById("screen").style.transform = "translate(-2500px)";
    document.querySelector(".quiz-form").style.transform = "translate(0px)";
    }
    else{
      document.getElementById("screen").classList.add("visible");
      document.getElementById("screen").style.transform = "translate(0px)";
      document.querySelector(".quiz-form").style.transform = "translate(-2500px)";
  };
  // Si el toggle es para ir al cuetionario se sale de la function para no calcular resulatdos
  // innecesariamente
  if (!document.getElementById("screen").classList.contains("visible")) { return;}; 



    // llama al procedimiento que llena el Array respuestas

    revisaFormulariodeRespuestas();  
    //  respuestas = respuestasFake;  
    console.log("respuestas " + respuestas); 



    // Manda a Evaluar cada escala (plantilla)
    var resp = new Object();

    resp.nombre=document.getElementById("nombreapellido").value;
    resp.fecha=document.getElementById("fecha").value;

    // Baja el Array de Respuestas al folder local dowmload.
    filename= "MMPI_" + resp.nombre + "_" + getTime();
    download(filename+".txt",respuestas);   



   // Llama al procedimineto que evalua cada escala y pega el resultado a 
   //    el objeto resp

    L = evaluaPlantilla(escalaL,respuestas);
    resp.L = L;
    console.log("Variable L ====>>> " + L); 
    console.log("-------------------------");
    

    F = evaluaPlantilla(escalaF,respuestas);
    resp.F = F;
    console.log("Variable F ====>>> " + F); 
    console.log("-------------------------");
    
    
    K = evaluaPlantilla(escalaK,respuestas);
    resp.K=K;
    console.log("Variable K ====>>> " + K); 
    console.log("-------------------------");
    

  // En  MMPI adolecentes no se usa

  // Evalua Tabla de factores K
  // fk = getfactorK(K,tablaFactoresK);
    
        
    Hs = evaluaPlantilla(escalaHs,respuestas);
    resp.Hs=Hs;
    resp.THs = Hs + 0;
    console.log("Variable Hs ====>>> " + Hs); 
    console.log("Variable Total Hs ====>>> " + resp.THs);
    console.log("-------------------------");
    
           
    D = evaluaPlantilla(escalaD,respuestas);
    resp.D=D;
    console.log("Variable D ====>>> " + D); 
    console.log("-------------------------");
    
               
    Hy = evaluaPlantilla(escalaHy,respuestas);
    resp.Hy=Hy;
    console.log("Variable Hy ====>>> " + Hy); 
    console.log("-------------------------");
    
    
    Pd = evaluaPlantilla(escalaPd,respuestas);
    resp.Pd = Pd;
    resp.TPd = Pd + 0;
    console.log("Variable Pd ====>>> " + Pd); 
    console.log("Variable Total Pd ====>>> " + resp.TPd);
    console.log("-------------------------");
    
        
    MfM = evaluaPlantilla(escalaMfM,respuestas);
    resp.MfM=MfM;
    console.log("Variable MfM ====>>> " + MfM); 
    console.log("-------------------------");
     
        
    MfF = evaluaPlantilla(escalaMfF,respuestas);
    resp.MfF=MfF;
    console.log("Variable MfF ====>>> " + MfF); 
    console.log("-------------------------");
     
        
    Pa = evaluaPlantilla(escalaPa,respuestas);
    resp.Pa=Pa;
    console.log("Variable Pa ====>>> " + Pa); 
    console.log("-------------------------");
     
    Pt = evaluaPlantilla(escalaPt,respuestas);
    resp.Pt=Pt;
    resp.TPt=Pt+0;
    console.log("Variable Pt ====>>> " + Pt); 
    console.log("Variable Total Pt ====>>> " + resp.TPt);
    console.log("-------------------------");
     
    Sc = evaluaPlantilla(escalaSc,respuestas);
    resp.Sc=Sc;
    resp.TSc= Sc+0;
    console.log("Variable Sc ====>>> " + Sc); 
    console.log("Variable Total Sc ====>>> " + resp.TSc);
    console.log("-------------------------");

    Ma = evaluaPlantilla(escalaMa,respuestas);
    resp.Ma=Ma;
    resp.TMa = Ma + 0;
    console.log("Variable Ma ====>>> " + Ma); 
    console.log("Variable Total Ma ====>>> " + resp.TMa);
    console.log("-------------------------");

    Si = evaluaPlantilla(escalaSi,respuestas);
    resp.Si=Si;
    console.log("Variable Si ====>>> " + Si); 
    console.log("-------------------------");

    //--------------------------------------------
    // SUB ESCALAS HARRYS LINGOES-----------------
    //--------------------------------------------
console.log("Voy a evaluar subescalas HarrysLingoes a continuacion<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")


    // DEPRESION

    D1 = evaluaPlantilla(escalaD1,respuestas);
    resp.D1=D1;
    console.log("Variable D1 ====>>> " + D1); 
    console.log("-------------------------");

    D2 = evaluaPlantilla(escalaD2,respuestas);
    resp.D2=D2;
    console.log("Variable D2 ====>>> " + D2); 
    console.log("-------------------------");

    D3 = evaluaPlantilla(escalaD3,respuestas);
    resp.D3=D3;
    console.log("Variable D3 ====>>> " + D3); 
    console.log("-------------------------");

    D4 = evaluaPlantilla(escalaD4,respuestas);
    resp.D4=D4;
    console.log("Variable D4 ====>>> " + D4); 
    console.log("-------------------------");

    D5 = evaluaPlantilla(escalaD5,respuestas);
    resp.D5=D5;
    console.log("Variable D5  ====>>> " + D5); 
    console.log("-------------------------");


// HISTERIA    ----------------------------------------

    HY1 = evaluaPlantilla(escalaHY1,respuestas);
    resp.HY1=HY1;
    console.log("Variable HY1 ====>>> " + HY1); 
    console.log("-------------------------");    


    HY2 = evaluaPlantilla(escalaHY2,respuestas);
    resp.HY2=HY2;
    console.log("Variable HY2 ====>>> " + HY2); 
    console.log("-------------------------");


    HY3 = evaluaPlantilla(escalaHY3,respuestas);
    resp.HY3=HY3;
    console.log("Variable HY3 ====>>> " + HY3); 
    console.log("-------------------------");


    HY4 = evaluaPlantilla(escalaHY4,respuestas);
    resp.HY4=HY4;
    console.log("Variable HY4 ====>>> " + HY4); 
    console.log("-------------------------");


    HY5 = evaluaPlantilla(escalaHY5,respuestas);
    resp.HY5=HY5;
    console.log("Variable HY5 ====>>> " + HY5); 
    console.log("-------------------------");    


// PSICOLPATIA    -------------------------------------------

PD1 = evaluaPlantilla(escalaPD1,respuestas);
resp.PD1=PD1;
console.log("Variable PD1 ====>>> " + PD1); 
console.log("-------------------------"); 
    

PD2 = evaluaPlantilla(escalaPD2,respuestas);
resp.PD2=PD2;
console.log("Variable PD2 ====>>> " + PD2); 
console.log("-------------------------"); 


PD3 = evaluaPlantilla(escalaPD3,respuestas);
resp.PD3=PD3;
console.log("Variable PD3 ====>>> " + PD3); 
console.log("-------------------------"); 
    

PD4 = evaluaPlantilla(escalaPD4,respuestas);
resp.PD4=PD4;
console.log("Variable PD4 ====>>> " + PD4); 
console.log("-------------------------"); 


PD5 = evaluaPlantilla(escalaPD5,respuestas);
resp.PD5=PD5;
console.log("Variable PD5 ====>>> " + PD5); 
console.log("-------------------------"); 


// PARANOYA

PA1 = evaluaPlantilla(escalaPA1,respuestas);
resp.PA1=PA1;
console.log("Variable PA1 ====>>> " + PA1); 
console.log("-------------------------"); 

PA2 = evaluaPlantilla(escalaPA2,respuestas);
resp.PA2=PA2;
console.log("Variable PA2 ====>>> " + PA2); 
console.log("-------------------------"); 

PA3 = evaluaPlantilla(escalaPA3,respuestas);
resp.PA3=PA3;
console.log("Variable PA3 ====>>> " + PA3); 
console.log("-------------------------"); 

// ESCALA ESQUISOFRENIA Sc

SC1 = evaluaPlantilla(escalaSC1,respuestas);
resp.SC1=SC1;
console.log("Variable SC1 ====>>> " + SC1); 
console.log("-------------------------"); 

SC2 = evaluaPlantilla(escalaSC2,respuestas);
resp.SC2=SC2;
console.log("Variable SC2 ====>>> " + SC2); 
console.log("-------------------------"); 

SC3 = evaluaPlantilla(escalaSC3,respuestas);
resp.SC3=SC3;
console.log("Variable SC3 ====>>> " + SC3); 
console.log("-------------------------"); 

SC4 = evaluaPlantilla(escalaSC4,respuestas);
resp.SC4=SC4;
console.log("Variable SC4 ====>>> " + SC4); 
console.log("-------------------------"); 

SC5 = evaluaPlantilla(escalaSC5,respuestas);
resp.SC5=SC5;
console.log("Variable SC5 ====>>> " + SC5); 
console.log("-------------------------"); 

SC6 = evaluaPlantilla(escalaSC6,respuestas);
resp.SC6=SC6;
console.log("Variable SC6 ====>>> " + SC6); 
console.log("-------------------------"); 


// SUBESCALA HIPOMANIA

MA1 = evaluaPlantilla(escalaMA1,respuestas);
resp.MA1=MA1;
console.log("Variable MA1 ====>>> " + MA1); 
console.log("-------------------------"); 

MA2 = evaluaPlantilla(escalaMA2,respuestas);
resp.MA2=MA2;
console.log("Variable MA2 ====>>> " + MA2); 
console.log("-------------------------"); 

MA3 = evaluaPlantilla(escalaMA3,respuestas);
resp.MA3=MA3;
console.log("Variable MA3 ====>>> " + MA3); 
console.log("-------------------------"); 

MA4 = evaluaPlantilla(escalaMA4,respuestas);
resp.MA4=MA4;
console.log("Variable MA4 ====>>> " + MA4); 
console.log("-------------------------"); 

// Fin de evaluar las escalas


   
// Cambia los valores en la Table

document.getElementById("L").innerHTML = resp.L;
document.getElementById("F").innerHTML = resp.F;
document.getElementById("K").innerHTML = resp.K;
document.getElementById("THs").innerHTML = resp.THs;
document.getElementById("D").innerHTML = resp.D;
document.getElementById("Hy").innerHTML = resp.Hy;
document.getElementById("TPd").innerHTML = resp.TPd;
document.getElementById("MfM").innerHTML = resp.MfM;
document.getElementById("MfF").innerHTML = resp.MfF;
document.getElementById("Pa").innerHTML = resp.Pa;
document.getElementById("TPt").innerHTML = resp.TPt;
document.getElementById("TSc").innerHTML = resp.TSc;
document.getElementById("TMa").innerHTML = resp.TMa;
document.getElementById("Si").innerHTML = resp.Si;

// EN el MMPI de adolecentes no se ajusta con K

// document.getElementById("Hs").innerHTML = resp.Hs;
// document.getElementById("Pd").innerHTML = resp.Pd;
// document.getElementById("Pt").innerHTML = resp.Pt;
// document.getElementById("Sc").innerHTML = resp.Sc;
// document.getElementById("Ma").innerHTML = resp.Ma;



// document.getElementById("KHs").innerHTML = fk.factor5k;
// document.getElementById("KPd").innerHTML = fk.factor4k;
// document.getElementById("KPt").innerHTML = resp.K;
// document.getElementById("KSc").innerHTML = resp.K;
// document.getElementById("KMa").innerHTML = fk.factor2k;

// SubEscalas

document.getElementById("D1").innerHTML = resp.D1;
document.getElementById("D2").innerHTML = resp.D2;
document.getElementById("D3").innerHTML = resp.D3;
document.getElementById("D4").innerHTML = resp.D4;
document.getElementById("D5").innerHTML = resp.D5;

document.getElementById("HY1").innerHTML = resp.HY1;
document.getElementById("HY2").innerHTML = resp.HY2;
document.getElementById("HY3").innerHTML = resp.HY3;
document.getElementById("HY4").innerHTML = resp.HY4;
document.getElementById("HY5").innerHTML = resp.HY5;

document.getElementById("PD1").innerHTML = resp.PD1;
document.getElementById("PD2").innerHTML = resp.PD2;
document.getElementById("PD3").innerHTML = resp.PD3;
document.getElementById("PD4").innerHTML = resp.PD4;
document.getElementById("PD5").innerHTML = resp.PD5;

document.getElementById("PA1").innerHTML = resp.PA1;
document.getElementById("PA2").innerHTML = resp.PA2;
document.getElementById("PA3").innerHTML = resp.PA3;


document.getElementById("SC1").innerHTML = resp.SC1;
document.getElementById("SC2").innerHTML = resp.SC2;
document.getElementById("SC3").innerHTML = resp.SC3;
document.getElementById("SC4").innerHTML = resp.SC1;
document.getElementById("SC5").innerHTML = resp.SC2;
document.getElementById("SC6").innerHTML = resp.SC3;

document.getElementById("MA1").innerHTML = resp.MA1;
document.getElementById("MA2").innerHTML = resp.MA2;
document.getElementById("MA3").innerHTML = resp.MA3;
document.getElementById("MA4").innerHTML = resp.MA4;


  console.log(resp);



  }  //Fin de mostrarresultados





function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}




//==========================//
//-------- Main ------------//
//==========================//


setFecha();
getTime();
armaPreguntasHtml();




 