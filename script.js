const selector = document.getElementById("lenguaje");
const contenido = document.getElementById("contenido");

// funcion principal k hace toda la consulta y muestra los datos
async function buscarRepositorio() {
  const lenguaje = selector.value;

  // 1. esto valida k el select no este vacio
  if (lenguaje === "") {
    contenido.innerHTML = `<div class="mensaje">Por favor, selecciona un lenguaje</div>`;
    return;
  }

  // 2. muestra un mensaje de carga mientras espera la respuesta de la api
  contenido.innerHTML = `<div class="mensaje">Cargando, por favor espera...</div>`;

  try {
    // 3. arma la url pa consultar la api de github y hace la peticion (fetch)
    const pagina = Math.floor(Math.random() * 10) + 1;
    const url = `https://api.github.com/search/repositories?q=language:${lenguaje}&sort=stars&order=desc&per_page=1&page=${pagina}`;
    
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    const repo = datos.items[0]; // saca solo el primer repo de la lista

    // 4. mete el html en el dom con los datos del repo
    contenido.innerHTML = `
      <div class="repositorio">
        <div class="cabecera">
          <h2>${repo.name}</h2>
          <a class="enlace" href="${repo.html_url}" target="_blank">↗</a>
        </div>
        <p class="descripcion">${repo.description || "Sin descripción"}</p>
        <div class="datos">
          <span>${repo.language}</span>
          <span>★ ${repo.stargazers_count.toLocaleString("es-CO")} estrellas</span>
          <span>${repo.forks_count.toLocaleString("es-CO")} forks</span>
          <span>${repo.open_issues_count.toLocaleString("es-CO")} issues</span>
        </div>
      </div>
      <button id="btn-actualizar" class="boton negro">Actualizar</button>
    `;
    
    // le pone el evento al boton de actualizar pa k vuelva a ejecutar la consulta
    document.getElementById("btn-actualizar").addEventListener("click", buscarRepositorio);

  } catch {
    // 5. atrapa cualkier error (tipo si no hay internet o falla la api)
    contenido.innerHTML = `
      <div class="mensaje error">Error al obtener los repositorios</div>
      <button id="btn-reintentar" class="boton rojo">Haz clic para reintentar</button>
    `;
    document.getElementById("btn-reintentar").addEventListener("click", buscarRepositorio);
  }
}

// 6. evento pa detectar cuando cambie la opcion en el select
selector.addEventListener("change", buscarRepositorio);

// arranca la funcion al inicio pa mostrar como esta por defecto
buscarRepositorio();