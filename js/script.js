//Declaração de Variaveis
//objeto
var cena = null;
var camera = null;
var renderizacao  = null;
var terraMaterial = null;
var estrelaGeometria = null;
var estrelaMaterial = null;
var ceuEstrelado = null;
var terraTextura = null;
var terraGeometria = null;
var terraMaterial = null;
var terra = null;
var luz = null;
var dirLuz = null;
//Elementos
var Section = document.getElementsByTagName('section');
var Titulo = document.querySelectorAll('section h1');
var Cep = document.getElementsByName('cep');
//var carregador = new THREE.GLTFLoader();
//Constantes
const ZOOM = 20

//------------------Escopo
configuracaoInicial();//Configura o Cenário, Camera e Renderização
configuracaoAmbiente();//Configura o Ambiente 3D
configuracao3D();//Configura o Objeto 3D e adiciona no ambiente desejado
configuracaoLuz();//Configura a Luz do Cenário
animaTerra();//Renderiza o quadro 3d e Anima a Terra
var Z = setTimeout(function(){
	clearTimeout(Z);
	introducao();//Inicia a Introdução da Página ao ser carregada
}, 5000);
//------------------Funções
/*
*Função: configuraInicial()
*Descrição: Responsavel por construir a camera, cena e renderização do quadro 3d
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function configuracaoInicial(){
	//Constrói uma cena 
	cena = new THREE.Scene();
	//Constrói uma camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = ZOOM; //Responsavel por dar o zoom no objeto 3d
	//Constrói a Renderização
	renderizacao = new THREE.WebGLRenderer({antialias: true});
	renderizacao.setSize(window.innerWidth, window.innerHeight);
	//Ejeta o o quadro renderizado na página HTML
	document.getElementById('fundo').appendChild(renderizacao.domElement);
}
/*
*Função: configuraAmbiente()
*Descrição: Responsavel por Configurar a ambientação do cenário e seu fundo estrelado
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function configuracaoAmbiente(){
	//Criando um fundo estrelado
	estrelaGeometria = new THREE.SphereGeometry(100, 64, 64);//Cria o material e sua dimensão
	const textura = new THREE.TextureLoader().load('img/estrelas.jpg')
	estrelaMaterial = new THREE.MeshBasicMaterial({
		map: textura,
		side: THREE.BackSide
	});
	ceuEstrelado = new THREE.Mesh(estrelaGeometria, estrelaMaterial);//Cria o Ceu com a textura e o material definidos
	cena.add(ceuEstrelado);//Adiciona o Ceu estrelado na cena do quadro 3d
}
/*
*Função: configuraAmbiente()
*Descrição: Responsavel por Criar, texturizar e modelar o planeta terra 3d
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function configuracao3D(){
    // Adicionando a Textura para o Planeta Terra 
    terraTextura = new THREE.TextureLoader().load('img/terra.jpg'); // Textura da terra

    // Adiciona os materiais com suas respectivas texturas
    terraMaterial = new THREE.MeshBasicMaterial({map: terraTextura});

    // Adiciona as geometrias
    terraGeometria = new THREE.SphereGeometry(1.02, 32, 32); // Aumentei o raio para que as texturas não fiquem coladas à esfera

    // Cria os meshes para cada parte do planeta
    terra = new THREE.Mesh(terraGeometria, terraMaterial);
    // Adiciona cada parte do planeta à cena
    cena.add(terra);
}
/*
*Função: configuraLuz()
*Descrição: Responsavel por Configurar a Luz do Cenário e sua direção
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function configuracaoLuz(){
	//Adicionando uma luz ao ambiente
	luz = new THREE.AmbientLight(0xffffff, 0.2);
	cena.add(luz); //adicionando Luz na Cena

	//Aplicando uma direção para luz
	dirLuz = new THREE.DirectionalLight(0xffffff, 0.8);
	dirLuz.position.set(8, 7, 2);
	cena.add(dirLuz);//Adicionando Direção da Luz para cena 
}
/*
*Função: animaterra()
*Descrição: Rotaciona a Terra no Eixo Y
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function animaTerra(){
	requestAnimationFrame(animaTerra);
	// Girando o planeta Terra lentamente
	terra.rotation.y += 0.001;
	renderizacao.render(cena, camera);//Renderiza todos os dados fornecidos ao quadro 3d
}
/*
*Função: introducao()
*Descrição: Responsavel por iniciar uma animação introdutória após carregar a página e seus elementos
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function introducao(){
	Titulo[0].style.animation = '2s titulo_desaparece';

	var Z = setTimeout(()=>{
		clearTimeout(Z);
		Section[0].classList.remove("d-flex");
		Section[0].classList.add("d-none");
		Titulo[0].style.display = 'none';
		darZoom(20);
	}, 2000);

}
/*
*Função: darZoom(valor inicial do Zoom aplicado)
*Descrição: Responsavel por dar o zoom necessário em cima do planeta
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function darZoom(nCont){
	var Y = setInterval(()=>{
		nCont -= 0.1;
		if(nCont > 2){
			nCont--;
		}else{
			clearInterval(Y);
			Section[1].style.display = 'block';
		}
		camera.position.z = nCont;
	}, 55);
}
/*
*Função: mascaraCep
*Descrição: Responsavel por colocar um traço divisório entre os dados do cep
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function mascaraCep(){
	var Aux = '';
	
	if((Cep[0].value).length >= 5 ){
		for(nCont = 0; nCont <= Cep[0].value.length -1; nCont++){
			if(nCont === 5){
				Aux += '-' ;
			}
			Aux += Cep[0].value.indexOf(nCont);
		}
	}
	
	Cep[0].value = Aux;
}
