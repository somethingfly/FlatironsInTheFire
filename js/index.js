const flatironUrl = "http://localhost:3000"
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
    const back = document.getElementById("back");
    const forward = document.getElementById("forward");
    back.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            fetchflatirons();
        }
    });    
    forward.addEventListener("click", function () {
        currentPage++
        fetchflatirons();
    });
    fetchflatirons();
    createflatironForm();
});

function fetchflatirons() {
    fetch(flatironUrl + "/flatirons/?_limit=50&_page=" + currentPage)
        .then((resp) => resp.json())
        .then((flatirons) => renderflatirons(flatirons));
}

function renderflatirons(flatirons) {
    const flatironContainer = document.getElementById("flatiron-container");
    while (flatironContainer.firstChild) {
        flatironContainer.removeChild(flatironContainer.firstChild);
    };
    flatirons.forEach(flatiron => {renderflatiron(flatiron.url,flatiron.quote,flatiron.comment)});
}

function renderflatiron(flatironUrl,flatironQuote,flatironComment) {
    const flatironContainer = document.getElementById("flatiron-container");
    const div = document.createElement("div");
    const h2 = document.createElement("h2");
    const h4 = document.createElement("h4");
    const p = document.createElement("p");
    h2.innerText = flatironUrl;
    h4.innerText = flatironQuote;
    p.innerText = flatironComment;
    div.appendChild(h2);
    div.appendChild(h4);
    div.appendChild(p);
    flatironContainer.appendChild(div);
}

function createflatironForm() {
    const createflatiron = document.getElementById("create-flatiron");
    const form = document.createElement("form");
    const inputUrl = document.createElement("input");
    const inputQuote = document.createElement("input");
    const inputComment = document.createElement("input");
    const create = document.createElement("button");
    form.id = "flatiron-form";
    inputUrl.id = "url";
    inputUrl.placeholder = "URL...";
    inputQuote.id = "quote";
    inputQuote.placeholder = "quote...";
    inputComment.id = "comment";
    inputComment.placeholder = "comment...";
    create.innerText = "Create";
    form.appendChild(inputUrl);
    form.appendChild(inputQuote);
    form.appendChild(inputComment);
    form.appendChild(create);
    createflatiron.appendChild(form);
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        postflatiron(inputUrl.value,inputQuote.value,inputComment.value);
        form.reset();
    })
}

function postflatiron(url,quote,comment) {
    fetch(flatironUrl + "/flatirons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
            url: url,
            quote: quote,
            comment: comment
        })
    })
}