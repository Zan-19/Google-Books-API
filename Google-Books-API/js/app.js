$( document ).ready(function() {
  console.log("ready");
  var item, title, author, publisher, bookLink, bookImg;
  var outputList = document.getElementById("list-output");
  var bookUrl = "https://www.googleapis.com/books/v1/volumes?q=";
  var placeHldr = '<img src="Book.jpg">';
  var searchData;

  $("#search").click(function(){
    outputList.innerHTML = ""
    searchData = $("#search-box").val();
    if(searchData === "" || searchData === null){
      displayError();
    }
    else {
      $.ajax({
        url: bookUrl + searchData,
        dataType: "json",
        success: function(res){
          console.log(res)
          if(res.totalItems === 0){
            alert("no results!.. try again");
          }
          else {
           $("#title").animate({'margin-top' : '5px'}, 1000);
            $(".book-list").css('visibility: visible');
            displayResults(res);
          }
        },
        error: function(){
          alert("Something went wrong!...");
        }
      })
    }
    $("#search-box").val("");
  });
  function displayError() {
    alert("Please enter a search term.");
  }
console.log("GOT");
function displayResults(res) {
  console.log("Displaying", res.items.length, "items");
  const placeholder = "Book.jpg";
  const outputList = document.getElementById("list-output");
  outputList.innerHTML = ""; 

  for (let i = 0; i < res.items.length; i += 2) {
    const item1 = res.items[i];
    const item2 = res.items[i + 1];

    const row = document.createElement("div");
    row.className = "row mt-4";

    row.innerHTML += formatOutput(
      (item1.volumeInfo.imageLinks?.thumbnail || placeholder),
      (item1.volumeInfo.title || "No title"),
      (item1.volumeInfo.authors?.join(", ") || "Unknown Author"),
      (item1.volumeInfo.publisher || "Unknown Publisher"),
      (item1.volumeInfo.previewLink || "#"),
      (item1.volumeInfo.industryIdentifiers?.[0]?.identifier || "N/A")
    );

    if (item2) {
      row.innerHTML += formatOutput(
        (item2.volumeInfo.imageLinks?.thumbnail || placeholder),
        (item2.volumeInfo.title || "No title"),
        (item2.volumeInfo.authors?.join(", ") || "Unknown Author"),
        (item2.volumeInfo.publisher || "Unknown Publisher"),
        (item2.volumeInfo.previewLink || "#"),
        (item2.volumeInfo.industryIdentifiers?.[0]?.identifier || "N/A")
      );
    }

    outputList.appendChild(row);
  }

}



//     console.log("Generated HTML:", output);
    //  $("#book-list").css("visibility", "visible");
    //  outputList.innerHTML += output;



  function formatOutput(bookImg, title, author, publisher, bookLink, bookIsbn) {
  console.log("Output");
  const viewerUrl = 'book.html?isbn=' + encodeURIComponent(bookIsbn);
  const reviewId = `review-${bookIsbn}`;
  const inputId = `input-${bookIsbn}`;

  return `
    <div class="col-lg-6 mb-4">
      <div class="card h-100">
        <div class="row no-gutters">
          <div class="col-md-4">
            <img src="${bookImg}" class="card-img" alt="Book cover">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <p class="card-text"><strong>Author:</strong> ${author}</p>
              <p class="card-text"><strong>Publisher:</strong> ${publisher}</p>
              <a target="_blank" href="${viewerUrl}" class="btn btn-secondary mb-2">Read Book</a>


              <div>
                <h6>Write a Review:</h6>
                <textarea id="${inputId}" class="form-control mb-2" rows="2" placeholder="Enter your review..."></textarea>
                <button class="btn btn-sm btn-success" onclick='submitReview("${bookIsbn}")'>Submit Review</button>

              </div>
              <div id="${reviewId}" class="mt-3">
                <h6>User Reviews:</h6>
                <ul class="list-unstyled review-list"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

}
function submitReview(bookIsbn) {
  const inputId = `input-${bookIsbn}`;
  const reviewId = `review-${bookIsbn}`;
  const reviewText = document.getElementById(inputId).value.trim();

  if (reviewText === "") {
    alert("Review cannot be empty.");
    return;
  }


  const stored = JSON.parse(localStorage.getItem("reviews") || "{}");
  if (!stored[bookIsbn]) stored[bookIsbn] = [];
  stored[bookIsbn].push(reviewText);
  localStorage.setItem("reviews", JSON.stringify(stored));


  const reviewList = document.querySelector(`#${reviewId} .review-list`);
  const li = document.createElement("li");
  li.textContent = reviewText;
  reviewList.appendChild(li);


  document.getElementById(inputId).value = "";
}


});
