function copyText(text){
    navigator.clipboard.writeText(text);
    alert("Copiado:\n\n" + text);
    return text;
  }