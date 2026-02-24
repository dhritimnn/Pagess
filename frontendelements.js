let frontendobject = {
  headingname : 'Pagess-বজালী',
  headerimg : 'img/profile.webp',
  headername : 'Pagess Bajali',
  headerp : 'Get Your Own Page',
  about : ``,
  contact : '',
  copyright : 'Pagess',
}




function run(){
  document.querySelector('#aboutjs').innerHTML = frontendobject.about;
  document.querySelector('#contactjs').innerHTML = frontendobject.contact;
  document.querySelector('#headingnamejs').innerHTML = frontendobject.headingname;
  document.querySelector('#headernamejs').innerHTML = frontendobject.headername;
  document.querySelector('#headerpjs').innerHTML = frontendobject.headerp;
  document.querySelector('#copyrightnamejs').innerHTML += frontendobject.copyright;
  document.querySelector('#headerimgjs').src = frontendobject.headerimg;
}

run()