document.addEventListener("DOMContentLoaded", () => {
    const api = "https://lin.com.ng/filmhouse/index.php";
    // Event handlers for need_comment and dont_need_comment
    const nc = document.getElementsByClassName("need_comment"),
          dnc = document.getElementsByClassName("dont_need_comment");

    Array.from(nc).forEach(el => {
        el.onclick = function () {
            this.children[0].checked = true;
            this.nextElementSibling.innerHTML = `
                <textarea type="text" name="${this.children[0].name}_comment" rows="3" placeholder="Please enter a comment." required></textarea>
            `;
        };
    });

    Array.from(dnc).forEach(el => {
        el.onclick = function () {
            this.children[0].checked = true;
            this.nextElementSibling.nextElementSibling.innerHTML = '';
        };
    });

    // Filmhouse locations
    const filmhouse = [
        "Lagos - Leisure Mall, Surulere",
        "Lagos - Lekki IMAX",
        "Cross River - Marina, Calabar",
        "Ondo - Akure",
        "Oyo - Heritage Mall, Dugbe",
        "Oyo - Ventura Mall, Samonda",
        "Rivers - Port Harcourt Mall (Spar), Old GRA",
        "Kano - Ado Bayero Mall, Kano",
        "Delta - Asaba Mall",
        "Edo - Kada Plaza, Benin City",
        "Imo - Owerri Mall"
    ];

    // Search and populate locations
    document.getElementById("search_loc").onkeyup = function () {
        const searched = filmhouse.filter(loc =>
            loc.toLowerCase().includes(this.value.toLowerCase())
        );
        const resultHTML = searched
            .map(loc => `<div onclick='setvalue("${loc}")'>${loc}</div>`)
            .join("");
        document.getElementById("input-search-result").innerHTML = resultHTML;
    };

    window.setvalue = function (value) {
        document.getElementById("location").value = value;
        document.getElementById("input-search-result").innerHTML = '';
        document.getElementById("search_loc").value = value;
    };

    // Dynamically populate shows list
if(document.getElementById("shows-lister")){
    let showsHTML = "";
    for (let i = 1; i <= 30; i++) {
        showsHTML += `
            <div class="form-group">
                <label>Show ${i}</label>
                <div class="show-ops"><input type="radio" name="show_${i}" value="1"><span>Shown</span></div>
                <div class="show-ops"><input type="radio" name="show_${i}" value="0"><span>Not shown</span></div>
                <div></div>
            </div>`;
    }
    document.getElementById("shows-lister").innerHTML = showsHTML;
}
    // Form submission and modal logic
    document.getElementById("form").onsubmit = function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const submissionData = {};
        let failedShows = 0;

        formData.forEach((value, key) => {
            submissionData[key] = value;
            if (key.includes("show") && value === "0") {
                failedShows++;
            }
        });

        if (document.getElementById("location").value && Object.keys(submissionData).length > 1) {
            showModal(submissionData, failedShows);
            
        } else {
            document.getElementById("search_loc").focus();
        }
    };

    const showModal = (data, failed) => {
        document.getElementById("senddata").setAttribute("data",JSON.stringify(data));
        delete data.for;
        const entriesHTML = Object.entries(data)
            .map(([key, value]) => `
                <tr>
                    <td>${key.replace("_", " ")}</td>
                    <td>${value.replace(1,"Shown").replace(0, "Not shown")}</td>
                </tr>`)
            .join("");
        document.getElementById("entries").innerHTML = entriesHTML;
        if(document.getElementById("failed_shows") && document.getElementById("total_shows")){
            document.getElementById("failed_shows").innerText = failed;
        document.getElementById("total_shows").innerText = Object.keys(data).length - 1;
        }
        document.getElementById("modal").style.display = "flex";
    };

    document.getElementById("modal").querySelector(".close").onclick = () => {
        document.getElementById("modal").style.display = "none";
    };
    document.getElementById("senddata").onclick = async ()=>{
    document.getElementById("loading").style.display = "flex";
     const req = await fetch(api,{
      method:"POST",
      body:document.getElementById("senddata").getAttribute("data")
     });
     const res = await req.json();
     if(res.status == 1){
        document.getElementById("loading-image").style.backgroundImage = `url('../assets/images/check.gif')`;
         document.getElementById("loading-msg").textContent = `Your data has been sent and submited!`;
             setTimeout(()=>{
          location.reload()
     },3000);
     }

    }
});
