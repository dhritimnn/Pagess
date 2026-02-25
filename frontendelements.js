let frontendobject = {
  headingname : 'Pagess-বজালী',
  headerimg : 'img/profile.webp',
  headername : 'Pagess Bajali',
  headerp : 'Get Your Own Page',
  about : `Page is in construction. Will be ready till 27feb`,
  contact : '',
  copyright : 'Pagess',
  
  projects : [
    ['pagessbajali.vercel.app', 'slide1.png'],
    ['pagessbajali.vercel.app', 'slide1.png'],
  ]
}




function run(){
  document.querySelector('#aboutjs').innerHTML = frontendobject.about;
  document.querySelector('#contactjs').innerHTML = frontendobject.contact;
  document.querySelector('#headingnamejs').innerHTML = frontendobject.headingname;
  document.querySelector('#headernamejs').innerHTML = frontendobject.headername;
  document.querySelector('#headerpjs').innerHTML = frontendobject.headerp;
  document.querySelector('#copyrightnamejs').innerHTML += frontendobject.copyright;
  document.querySelector('#headerimgjs').src = frontendobject.headerimg;
  
  let projectchildframe = '';
  for (let i = 0; i<frontendobject.projects.length;i++) {
    let gett = frontendobject.projects[i];
    let x = gett[0]
    let y = gett[1]
    projectchildframe+= `<div class="pjchild">
        <img src="img/projectimg/${y}" alt="">
        <p>${x}</p>
      </div>`;
  }
  
  document.querySelector('#projectsjs').innerHTML = projectchildframe;
}

run()