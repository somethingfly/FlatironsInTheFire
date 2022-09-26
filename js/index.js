const flatironJsonUrl = "http://localhost:3000"
let currentPage = 1;
const urlObj = {};
const githubUrlObj = {};

document.addEventListener("DOMContentLoaded", () => {
    const back = document.getElementById("back");
    const forward = document.getElementById("forward");
    const urlDropdown = document.getElementById("url-dropdown");
    const githubUrlDropdown = document.getElementById("github-url-dropdown");
    back.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            fetchFlatirons();
        }
    });
    forward.addEventListener("click", function () {
        currentPage++
        fetchFlatirons();
    });
    urlDropdown.addEventListener("change", function () {
        githubUrlDropdown.value = "";
        currentPage = 0;
        if ((urlDropdown.value == "none") || (!(urlDropdown.value))) {
            fetchFlatirons();
        } else {
            fetchFlatirons(urlDropdown.value);
        }
    });
    githubUrlDropdown.addEventListener("change", function () {
        urlDropdown.value = "";
        currentPage = 0;
        if ((githubUrlDropdown.value == "none") || (!(githubUrlDropdown.value))) {
            fetchFlatirons();
        } else {
            fetchFlatirons(null,githubUrlDropdown.value);
        }
    });
    fetchFlatirons();
    createFlatironForm();
});

function fetchFlatirons(url="",githubUrl="") {
    let fetchUrl = new URL(flatironJsonUrl + "/flatirons/?_limit=50&_page=" + currentPage);
    if (url) {
        fetchUrl += "&" + new URLSearchParams({"url": url});
    } else if (githubUrl) {
        fetchUrl += "&" + new URLSearchParams({"githuburl": githubUrl});
    }
    fetch(fetchUrl)
        .then((resp) => resp.json())
        .then((flatirons) => renderFlatirons(flatirons));
}

function renderFlatirons(flatirons) {
    const flatironContainer = document.getElementById("flatiron-container");
    while (flatironContainer.firstChild) {
        flatironContainer.removeChild(flatironContainer.firstChild);
    };
    flatirons.forEach(flatiron => {
        let urlOption
        let githubUrlOption
        const urlDropdown = document.getElementById("url-dropdown");
        const githubUrlDropdown = document.getElementById("github-url-dropdown");
        if (!(urlObj[flatiron.url])) {
            urlObj[flatiron.url] = true;
            urlOption = document.createElement("option");
            urlOption.text = flatiron.url;
            urlDropdown.add(urlOption);
        }
        if ((!(githubUrlObj[flatiron.githuburl])) && flatiron.githuburl) {
            githubUrlObj[flatiron.githuburl] = true;
            githubUrlOption = document.createElement("option")
            githubUrlOption.text = flatiron.githuburl;
            githubUrlDropdown.add(githubUrlOption);
        }
        renderFlatiron(flatiron.id,flatiron.url,flatiron.quote,flatiron.comment,flatiron.datetime,flatiron.githuburl);
    });
}

function renderFlatiron(flatironId,flatironUrl,flatironQuote,flatironComment,flatironDatetime,flatironGithubUrl="") {
    const flatironContainer = document.getElementById("flatiron-container");
    const div = document.createElement("div");
    const h2 = document.createElement("h2");
    let h3
    const h4 = document.createElement("h4");
    const p = document.createElement("p");
    const pi = document.createElement("p");
    h2.innerText = flatironUrl;
    h4.innerText = flatironQuote;
    p.innerText = flatironComment;
    pi.innerText = flatironDatetime;
    pi.style.fontStyle = "italic";
    div.appendChild(h2);
    if (flatironGithubUrl) {
        h3 = document.createElement("h3");
        h3.innerText = flatironGithubUrl;
        h3.style.fontStyle = "italic";
        div.appendChild(h3);
    }
    div.appendChild(h4);
    div.appendChild(p);
    div.appendChild(pi);
    flatironContainer.appendChild(div);
    h2.addEventListener("click", (e) => makeEditable(h2,flatironUrl,flatironId,"url",));
    if (flatironGithubUrl) {
        h3.addEventListener("click", (e) => makeEditable(h3,flatironGithubUrl,flatironId,"githuburl"));        
    }
    h4.addEventListener("click", (e) => makeEditable(h4,flatironQuote,flatironId,"quote"));
    p.addEventListener("click", (e) => makeEditable(p,flatironComment,flatironId,"comment"));
    pi.addEventListener("click", (e) => makeEditable(pi,flatironDatetime,flatironId,"datetime"));
}

function makeEditable(element,elementValue,flatironId,patchKey) {
    let formExist = document.getElementById(flatironId + patchKey);
    if (formExist) {
        if (formExist.style.display != "none") {
            formExist.style.display = "none";
        } else {
            formExist.style.display = "block";
        }
    }  else {
        const form = document.createElement("form");
        const textarea = document.createElement("textarea");
        const edit = document.createElement("button");
        textarea.value = elementValue;
        edit.innerText = "Edit";
        form.id = flatironId + patchKey;
        form.appendChild(textarea);
        form.appendChild(edit);
        element.parentNode.insertBefore(form,element.nextSibling);
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            patchFlatiron(element,flatironId,patchKey,textarea.value.replace(/[\u200B-\u200F\uFEFF]/g,''));
        });
    }
}


function createFlatironForm() {
    const createFlatiron = document.getElementById("create-flatiron");
    const form = document.createElement("form");
    const inputUrl = document.createElement("input");
    const inputGithubUrl = document.createElement("input");
    const inputQuote = document.createElement("input");
    const inputComment = document.createElement("input");
    const inputDatetime = document.createElement("input");
    const create = document.createElement("button");
    form.id = "flatiron-form";
    inputUrl.id = "url";
    inputUrl.placeholder = "URL...";
    inputGithubUrl.id = "githuburl";
    inputGithubUrl.placeholder = "Github URL... (optional)";
    inputQuote.id = "quote";
    inputQuote.placeholder = "quote...";
    inputComment.id = "comment";
    inputComment.placeholder = "comment...";
    inputDatetime.id = "datetime";
    inputDatetime.placeholder = "datetime...";
    create.innerText = "Create";
    form.appendChild(inputUrl);
    form.appendChild(inputGithubUrl);
    form.appendChild(inputQuote);
    form.appendChild(inputComment);
    form.appendChild(inputDatetime);
    form.appendChild(create);
    createFlatiron.appendChild(form);
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        postFlatiron(inputUrl.value,inputQuote.value,inputComment.value,inputDatetime.value.replace(/[\u200B-\u200F\uFEFF]/g,''),inputGithubUrl.value);
        form.reset();
    });
}

function postFlatiron(url,quote,comment,datetime,githuburl="") {
    const createFlatironResponse = document.getElementById("create-flatiron-response");
    createFlatironResponse.innerHTML = "";
    fetch(flatironJsonUrl + "/flatirons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
            url: url,
            githuburl: githuburl, 
            quote: quote,
            comment: comment,
            datetime: datetime
        })
    })
        .then(data => data.json())
        .then(data => {
            Object.keys(data).forEach(key => {
                createFlatironResponse.innerHTML += key + ": " + data[key] + "<br>";
            })
        });
}

function patchFlatiron(element,flatironId,patchKey,patchValue) {
    fetch(flatironJsonUrl + "/flatirons/" + flatironId, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
            [patchKey]: patchValue
        })
    })
        .then(data => {
            element.innerText = patchValue;
        });
}