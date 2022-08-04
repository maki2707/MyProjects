import React from "react";
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';



const Home = () => {
	const slides = [
		{ title: 'O nama',
		 	description: 'Naše željeznice koriste sustav senzora Gotcha, gdje su nam inspiriracija bile suvremene željeznice u Nizozemskoj. Time smanjujemo vrijeme vlakova izvan uporabe i postižemo sigurniji i udobniji prijevoz putnika.',
			image: 'o-nama'},
		{ title: 'Ekologija', 
			description: 'Od svih vrsta prometa željeznički promet ekološki je najprihvatljiviji i održiv na dulji rok. U skladu s time naš putnički prijevoz svoju razvojnu politiku usmjerava prema poslovnim i društvenim ciljevima koji ponajprije počivaju na načelima održiva razvoja i zaštite okoliša.',
			image: 'ekoloski'},
		{ title: 'COVID-19 mjere', 
			description: 'U cilju suzbijanja širenja bolesti COVID-19 molimo putnike da se pridržavaju epidemioloških mjera u našim vlakovima, što uključuje nošenje maski za lice i održavanje fizičke distance.', 
			image: 'covid-mjere'}
		
	  ];
	   
  return (
	<div>
      <div className='home-container'>
		<Slider autoplay='7000' infinite='true'>
			{slides.map((slide, index) => <div key={index}>
				<div className='slide-image-container'>
					<img className='slide-image' src={'../images/' + slide.image + '.jpg'} alt="alternatetext"/>
					<h2>{slide.title}</h2>
					<div className='slide-description'>{slide.description}</div>
				</div>
			</div>)}
		</Slider>
      </div>
	</div>
	);

}


export default Home;