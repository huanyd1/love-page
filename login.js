let valuePassword = ''; // dùng let để có thể thay đổi

function btnNumber(id) {
  // console.log(valuePassword.length); // nếu cần debug
  const passwordText = document.getElementById('passwordText'); // input hiển thị ●
  //console.log(passwordText.value.length);

  if (id === "Xóa") {
    // xóa ký tự cuối nếu còn ký tự
    if (valuePassword.length > 0) {
      valuePassword = valuePassword.slice(0, -1);
      // đồng thời xóa một ● trên input hiển thị
      passwordText.value = passwordText.value.slice(0, -1);
    }
  } else if (id === "OK") {
    if (valuePassword === "000000") {
      alert("OK");
      // nếu muốn reset sau OK:
      // valuePassword = '';
      // passwordText.value = '';
    } else {
      alert("Sai mật khẩu rồi 😳");
      valuePassword = "";
      passwordText.value = "";
    }
  } else {
    // nhấp số: chỉ thêm nếu chưa đủ 6 ký tự (index 0..5 -> length <=5)
    if (valuePassword.length <= 5) {
      valuePassword += id;            // lưu giá trị thật
      passwordText.value += "●";     // hiển thị ●
    }
  }
  // debug (tuỳ bạn có muốn)
}