const customer1Balance = $("#custBalance").val();
const transferAmount = $("#amount").val();
const recieverName = $("#recieverName").val();

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    $(".navbar").slideUp();
  } else {
    $(".navbar").slideDown();
  }
}

$(".transaction-form").submit((e) => {
  if (!recieverName) {
    alert("Select an account to transfer money to");
    e.preventDefault();
  }

  return;
});

function checkforblankSignup() {
  if (document.getElementById('username').value == "") {
    alert('Please enter username');
    return false;
  }
  else if (document.getElementById('password').value == "") {
    alert('Please enter password');
    return false;
  }
  else if (document.getElementById('balance').value == "") {
    alert('Please enter balance');
    return false;
  }
}

function checkforblankSignin() {
  if (document.getElementById('username').value == "") {
    alert('Please enter username');
    return false;
  }
  else if (document.getElementById('password').value == "") {
    alert('Please enter password');
    return false;
  }
}




