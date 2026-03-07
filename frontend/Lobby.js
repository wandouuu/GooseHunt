const image_input = document.querySelector("#image-input");

image_input.addEventListener("change",function(){
    const reader = new FileReader();

    reader.addEventListener("load", () =>{
        const uploaded_image = reader.result;
        const display_div = document.querySelector("#display-image");

        // 1. Set the background image
        display_div.style.backgroundImage = `url(${uploaded_image})`;
        
        // 2. Hide the "Click to Upload" text so it doesn't overlap the photo
        display_div.querySelector(".upload-text").style.display = "none";
        
        // 3. Remove the dashed border for a cleaner look
        display_div.style.borderStyle = "solid";
    });

    if(this.files && this.files[0]) {
        reader.readAsDataURL(this.files[0]);
    }
});

const joinBtn = document.querySelector("#join-game")
const join_pop_up = document.querySelector("#join-pop-up")
const close_pop_up = document.querySelector("#cancel")
const confirm_join =  document.querySelector("#confirm-join")

//open pop-up
joinBtn.addEventListener("click", () => {
    join_pop_up.style.display = "flex";
});

//close pop-up
close_pop_up.addEventListener("click", () => {
    join_pop_up.style.display = "none";
});

//close pop-up method 2
window.addEventListener("click", (event) =>{
    if (event.target == join_pop_up){
        join_pop_up.style.display = "none"
    }
});

//when confirm is pressed
confirm_join.addEventListener("click", () => {
    const lobbyInput = document.querySelector("#join-id");
    const idValue = lobbyInput.value; // Use .value, not .ariaValueMax
    
    if(idValue) {
        alert("Entering Lobby: " + idValue);
    } else {
        alert("Please enter a Lobby ID!");
    }
});


