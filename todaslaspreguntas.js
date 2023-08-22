function mostrarPreguntas(){





  var form = document.querySelector("form");

  for (var i = 1; i <= preguntas.length; i++) {

    var t = document.getElementById("templatepregunta");
    var clone = t.content.cloneNode(true);

    clone.getElementById("textoPregunta").innerHTML = preguntas[i-1];
    clone.getElementById("radio1").name = "p"+ i;
    clone.getElementById("radio2").name ="p"+ i;

    var tb = document.getElementById("quiz-form");
    tb.appendChild(clone)
 
   
  }
  return form;
}