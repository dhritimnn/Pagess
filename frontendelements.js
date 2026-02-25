let frontendobject = {
  headingname : 'Pagess-বজালী',
  headerimg : 'img/profile.webp',
  headername : 'Pagess Bajali',
  headerp : 'Get Your Own Page',
  about : `Page is in construction. Will be ready till 27feb`,
  contact : '',
  copyright : 'Pagess',
  
  projects : [
    ['pagessbajali.vercel.app/demo', 'slide1.jpg'],
    ['pagessbajali.vercel.app/demo2', 'slide1.jpg'],
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
  
  
  frontendobject.projects.reverse();
  let projectchildframe = '';
  for (let i = 0; i<frontendobject.projects.length;i++) {
    let gett = frontendobject.projects[i];
    let x = gett[0]
    let y = gett[1]
    projectchildframe+= `<div class="pjchild" onclick='window.location.href="https://${x}"'>
        <img src="img/projectimg/${y}" alt="">
        <p>${x}</p>
      </div>`;
  }
  
  document.querySelector('#projectsjs').innerHTML = projectchildframe;
}

run()