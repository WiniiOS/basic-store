/*Gestion du processus de creation du contenu de la boutique*/
const maxQuantity  = 9;
const productIdKey = "product";
const orderIdKey   = "order";
const inputIdKey   = "qte";
let   total 	   = 0;

// lance le processus de creation du contenu de la boutique des que la page a charge
const init = function (){
		
		createShop();
		// ecoutons le relachement de bouton clavier sur le champ filtre
		filter.addEventListener("keyup",filtre);
		
}
window.addEventListener("load",init);

//obtient l'index du produit dans le catalog et le produit lui meme(valide)
//en suite cree le produit en temps reel
const createShop = function () {
	const shop = document.getElementById("boutique");
	for(let i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
		//produit correspond a un index quelconque du array catalog,
		//et celui ci est represernte ici par 'i'
	}
}

// On cree entierement un produit dans la boutique(valide)
const createProduct = function (product, index) {
	const block = document.createElement("div");
	block.className = "produit";
	block.id = `${index}-${productIdKey}`;
	//on cree le titre du produit que l'on rattache a la div produit
	block.appendChild(createBlock("h4", product.name));
	block.appendChild(createFigureTag(product));
	// on cree la div description ,on lui donne son centenu a base du produit
	//,on lui donne sa class et la ratache au bloc de class Produit
	block.appendChild(createBlock("div",product.description, "description"));
	block.appendChild(createBlock("div", product.price, "prix"));
	block.appendChild(createOrderControlBlock(index));
	return block;
}

//on cree un tag specifique,on lui donne une class ,et on lui donnne du contenu puis on le retoune(valide)
const createBlock = function (tag, content, cssClass) {
	const element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className =  cssClass;
	}
	element.innerHTML = content;
	return element;
}

// on cree un espace  pour commander le produit(valide)
const createOrderControlBlock = function (index) {
	// 
	const control = document.createElement("div");
	control.className = "controle";
	// on cree le champ de choix du nombre d'articles
	const inputAndButtuon = `
	<input type="number" min="0" max="${maxQuantity.toString()}"oninput="activateOrder()" step="1" placeholder="0" id="${index}-${inputIdKey}"/>
	<button class="commander" id="${index}-${orderIdKey}" onclick="createAchat()" ></button>`;
	control.innerHTML = inputAndButtuon;
	return control;
}
// onclick="createAchat()" to add after the test

// on cree le tag 'figure' et l'image du produit qu'il contient(valide)
const createFigureTag = function (product) {
	const figure = createBlock("figure",`<img src="${product.image}" alt="${product.description}">`);
	return figure;
}


/*------------processus de creation du panier client----*/
// Gestion de la recherche(filtrage) articles

const filter = document.getElementById("filter");
// supprime tout le premier contenu de la boutique
function deleteFirstShop() {
	const boutique = document.getElementById('boutique');
	let articles = document.querySelectorAll('.produit');
	for(let i = 0; i < articles.length;i++) {
		boutique.removeChild(document.querySelector('.produit'));
	}
}

const filtre = function() {
	deleteFirstShop();
	//tolowercase pour avoir une insensibilite a la casse
	catalog = catalog.filter(function(product) {
		return product.name.toLowerCase().includes(filter.value.toLowerCase());
	});
	//gerer les accents francais plutard
	if (catalog.length === 0) {
		catalog = noResultcatalog;
		createShop();
	} else { 
		createShop();
	}
}

//gestion de l'effet OrderControl
window.activateOrder = function() {
	const allInputs = document.querySelectorAll(".controle>input");
	const allOrders = document.querySelectorAll(".controle>.commander");
	for(let i = 0; i < allOrders.length; i++){
		allOrders[i].style.opacity = 0.25;
		let singleValue = allInputs[i].value;
		if (singleValue >= 1 && singleValue <= 9) {
			allOrders[i].style.opacity = 1; 
		} else {
			allInputs[i].value = "0";
			allOrders[i].style.opacity = 0.25;
		}
	}
}

//Gestion de la mise en panier

//Ajoute le produit cliqué dans le panier si son bouton commander est actif 
function createAchat() {

	const allProducts = document.querySelectorAll(".produit");
	const allInputs   = document.querySelectorAll(".controle>input");
	const allOrders   = document.querySelectorAll(".controle>button");
	for (let i = 0; i < allOrders.length; i++) {
		if(allOrders[i].style.opacity == 1 && allInputs[i].value == allProducts[i].children[4].children[0].value){
				
				const achat = document.createElement("div");
				achat.classList.add("achat");
				achat.id = `${i}-achat`;
				const figure = document.createElement("figure");
				const img = document.createElement("img");
				img.src = `${allProducts[i].children[1].children[0].getAttribute("src")}`;
				img.alt = `${allProducts[i].children[2].textContent}`;
				figure.appendChild(img);
				achat.appendChild(figure);
				const miniTitle = document.createElement("h4");
				miniTitle.textContent = `${allProducts[i].children[2].textContent}`;
				achat.appendChild(miniTitle);
				const quantite = document.createElement("div");
				quantite.classList.add("quantite");
				quantite.innerHTML = `${allInputs[i].value}`;
				achat.appendChild(quantite);
				const prix = document.createElement("div");
				prix.classList.add("prix");
				prix.innerHTML = `${allProducts[i].children[3].textContent}`;
				achat.appendChild(prix);
				const control = document.createElement("div");
				control.classList.add("controle");
				const button = `<button class='retirer' onclick='deleteOrder()' id='${i}-remove'></button>`;
				const a = document.createElement("a");
				a.href = "#";
				a.classList.add("delete");
				a.innerHTML = button;
				control.appendChild(a);
				achat.appendChild(control);
				const panier = document.querySelector(".achats");
				
				//processus normal
				panier.appendChild(achat);
				allProducts[i].children[4].children[0].value = 0;		
				allOrders[i].style.opacity = 0.25;
				autoUpdateTotal();
				break;
		}
	}
}

//supprimer un produit du panier
function deleteOrder() {
	
	const myOrders = document.querySelectorAll(".achat");
	let deleteBg = document.querySelectorAll(".delete");
	for (let i = 0; i < myOrders.length; i++) {
		let deleteBgColor = deleteBg[i].style.backgroundColor;

		let achatToRemove = myOrders[i];
		document.querySelector(".achats").removeChild(achatToRemove);
		autoUpdateTotal();
		break;
	}
}        

//mettre a jour le total a chaque modification du panier
function autoUpdateTotal(){
	const allAchats = document.querySelector(".achats").children;
	let montant = parseInt(document.getElementById("montant").textContent);
	let Total = 0 ;
	for (let i = 0; i < allAchats.length; i++) {
		let Pu = parseInt(allAchats[i].children[3].textContent);
		let Qte = parseInt(allAchats[i].children[2].textContent);
		Total = Total + (Qte*Pu);
		montant = Total;
		document.getElementById("montant").textContent = montant;
	}
}


// cas où le produit ajouté est déjà présent dans le panier
function checkProductExisting() {
	//on recupere tous les produits ds le panier
	const allAchats = document.querySelector(".achats").children;
	//puis on verifie si le produit en cours d'ajout dans le panier correspond a ceux recuperes ds le panier

	//on recupere le produit en cours d'ajout


	
	//si oui on ajoute juste la qte du produit sinon on l'ajoute
	//on se  rassure que l'ajout de quantite plus la qte presente ne depasse pas 9 sinon
	//on averti le client qu'il ne peut commander plus de 9 fois le meme produit .
		// if (productToAdd===alreadyexistProduct et si qteUnitaire <=9 ds le panier) {
		
		// } else {
			
		// }
		// for (var z = 0; z < allAchats.length; z++) {
		// 	if(achat.children[1].textContent ==  allAchats[z].name){
		// 		//	si qteUnitaire <=9 ds le panier
		// 		if(allInputs[i].value + parseInt(allAchats[z].children[2].textContent <= 9) ) {
		// 			quantite.innerHTML = `${allInputs[i].value + parseInt(allAchats[z].children[2].textContent)}`;
		// 			autoUpdateTotal();
		// 			break;
		// 		}else{
		// 			alert("vous ne pouvez commander plus de 9 fois le meme produit");
		// 		}
		// 	}else{

		// 	}
		// }
}
// const allAchats = document.querySelector(".achats").children;




//RMQ= essayer de plus utiliser le forEach au lieu de la boucle for ....