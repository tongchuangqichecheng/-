// ============================================
// 同创汽车城 - 联系表单处理
// ============================================

function submitForm(e) {
  e.preventDefault();

  var form = document.getElementById('contactForm');
  var msg = document.getElementById('formMsg');
  var btn = form.querySelector('button[type="submit"]');

  // 获取表单数据
  var name = document.getElementById('name').value.trim();
  var phone = document.getElementById('phone').value.trim();
  var email = document.getElementById('email').value.trim();
  var interest = document.getElementById('interest').value;
  var message = document.getElementById('message').value.trim();

  // 简单验证
  if (!name || !phone) {
    showMsg('请填写姓名和联系电话', 'error');
    return;
  }

  // 手机号格式验证
  var phoneReg = /^1[3-9]\d{9}$/;
  if (!phoneReg.test(phone)) {
    showMsg('请输入正确的手机号码', 'error');
    return;
  }

  // 模拟提交（实际应发送到后端）
  btn.disabled = true;
  btn.textContent = '提交中...';

  setTimeout(function () {
    showMsg('感谢您的留言！我们将尽快与您联系。', 'success');
    form.reset();
    btn.disabled = false;
    btn.textContent = '提交留言';
  }, 1000);
}

// ============================================
// 显示表单消息
// ============================================
function showMsg(text, type) {
  var msg = document.getElementById('formMsg');
  if (!msg) return;

  msg.style.display = 'block';
  msg.style.color = type === 'success' ? '#16a34a' : '#dc2626';
  msg.style.background = type === 'success' ? '#dcfce7' : '#fee2e2';
  msg.textContent = text;

  if (type === 'success') {
    setTimeout(function () {
      msg.style.display = 'none';
    }, 5000);
  }
}
