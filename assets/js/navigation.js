//navigation.js

// Function to generate and insert the header content
function generateHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light fixed-top text-center" id="mainNav">
            <div class="container">
                <a class="navbar-brand" href="overview.html">Homes Overview</a>
                <strong class="navbar-brand">|</strong>
                <a class="navbar-brand" href="homes.html">Homes In Maps</a>
                <strong class="navbar-brand">|</strong>

                <a class="navbar-brand" href="index.html">Main Page</a>
            </div>
        </nav>
    `;
}

// Call the function to generate and insert the header
generateHeader();


//footer
function generateFootder() {
    const header = document.getElementById('footer');
    header.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light fixed-top text-center" id="mainNav">
            <div class="container">
                <a class="navbar-brand" href="overview.html">Homes Overview</a>
                <strong class="navbar-brand">|</strong>
                <a class="navbar-brand" href="homes.html">Homes In Maps</a>
                <strong class="navbar-brand">|</strong>

                <a class="navbar-brand" href="index.html">Main Page</a>
            </div>
        </nav>
    `;
}

generateFootder();



