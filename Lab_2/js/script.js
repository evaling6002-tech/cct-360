function changePage() {
    // 1. DOM Content 
    document.getElementById("title").innerHTML = "Background Transformed!";
    document.getElementById("description").innerHTML = "Image updated successfully.";

    // 2. DOM Style  
    document.getElementById("box").style.backgroundColor = "rgba(30, 30, 30, 0.88)";
    document.getElementById("title").style.color = "#ffffff";
    document.getElementById("description").style.color = "#dddddd";

    // 3. Bg image
    document.body.style.backgroundImage = "url('image/bg2.avif')";
     if (c) {
        document.getElementById("toChange").src = "image/bg2.avif";
    }

    // 4. BOM Dialog
    var c = confirm("Switch background image?");
    document.getElementById("result").innerHTML = "User choice: " + (c ? "Confirmed" : "Cancelled");
}

// Open Window
function openPopupWindow() {
    var popWindow = window.open("", "PopupWindow", "width=400,height=300");
    popWindow.document.write(`
      <!DOCTYPE html>
        <html>
        <head>
            <title>Pop-up Window</title>
            <style>
                body { font-family: sans-serif; text-align: center; padding: 40px; background: #f0f4f8; }
                h2 { color: #2c3e50; }
                p { color: #666; }
            </style>
        </head>
        <body>
            <h2>BOM Window</h2>
            <p>Thank you for viewing the web page!</p>
        </body>
        </html>
    `);
}