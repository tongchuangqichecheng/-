// ============================================
// 同创汽车城 - 联系表单处理（买车/卖车/入驻）
// 表单数据通过 FormSubmit 直接发送到邮箱
// ============================================

// 接收邮箱
var RECEIVER_EMAIL = 'tongchuang123456@qq.com';

// ============================================
// 切换表单
// ============================================
function switchForm(type) {
  // 隐藏所有表单
  document.getElementById('formBuy').style.display = 'none';
  document.getElementById('formSell').style.display = 'none';
  document.getElementById('formSettle').style.display = 'none';

  // 重置所有tab样式
  document.getElementById('tabBuy').style.background = 'var(--white)';
  document.getElementById('tabBuy').style.color = 'var(--gray-700)';
  document.getElementById('tabBuy').style.borderColor = 'var(--gray-300)';
  document.getElementById('tabSell').style.background = 'var(--white)';
  document.getElementById('tabSell').style.color = 'var(--gray-700)';
  document.getElementById('tabSell').style.borderColor = 'var(--gray-300)';
  document.getElementById('tabSettle').style.background = 'var(--white)';
  document.getElementById('tabSettle').style.color = 'var(--gray-700)';
  document.getElementById('tabSettle').style.borderColor = 'var(--gray-300)';

  // 显示目标表单并高亮tab
  if (type === 'buy') {
    document.getElementById('formBuy').style.display = 'block';
    document.getElementById('tabBuy').style.background = 'var(--primary)';
    document.getElementById('tabBuy').style.color = 'var(--white)';
    document.getElementById('tabBuy').style.borderColor = 'var(--primary)';
  } else if (type === 'sell') {
    document.getElementById('formSell').style.display = 'block';
    document.getElementById('tabSell').style.background = 'var(--primary)';
    document.getElementById('tabSell').style.color = 'var(--white)';
    document.getElementById('tabSell').style.borderColor = 'var(--primary)';
  } else if (type === 'settle') {
    document.getElementById('formSettle').style.display = 'block';
    document.getElementById('tabSettle').style.background = 'var(--primary)';
    document.getElementById('tabSettle').style.color = 'var(--white)';
    document.getElementById('tabSettle').style.borderColor = 'var(--primary)';
  }

  // 隐藏消息
  var msg = document.getElementById('formMsg');
  if (msg) msg.style.display = 'none';
}

// ============================================
// 提交表单 - 通过 FormSubmit 发送到邮箱
// ============================================
function submitForm(e, formType) {
  e.preventDefault();

  var prefix = formType === 'buy' ? 'buy' : (formType === 'sell' ? 'sell' : 'settle');
  var nameEl = document.getElementById(prefix + 'Name');
  var phoneEl = document.getElementById(prefix + 'Phone');
  var msg = document.getElementById('formMsg');
  var form = e.target;
  var btn = form.querySelector('button[type="submit"]');

  if (!nameEl || !phoneEl) return;

  var name = nameEl.value.trim();
  var phone = phoneEl.value.trim();

  if (!name || !phone) {
    showMsg('请填写姓名和联系电话', 'error');
    return;
  }

  var phoneReg = /^1[3-9]\d{9}$/;
  if (!phoneReg.test(phone) && !/^0\d{2,3}-?\d{7,8}$/.test(phone)) {
    showMsg('请输入正确的手机号码或固定电话', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = '提交中...';

  // 诉求类型文字
  var typeText = formType === 'buy' ? '买车诉求' : (formType === 'sell' ? '卖车诉求' : '入驻咨询');

  // 收集所有表单字段
  var formData = new FormData(form);
  var fields = {};
  formData.forEach(function(value, key) {
    fields[key] = value;
  });

  // 构建邮件内容
  var emailBody = '【同创汽车城 - ' + typeText + '】\n\n';
  emailBody += '姓名：' + (fields.name || '') + '\n';
  emailBody += '联系电话：' + (fields.phone || '') + '\n';

  if (formType === 'buy') {
    emailBody += '意向品牌/车型：' + (fields.brand || '未填写') + '\n';
    emailBody += '购车预算：' + (fields.budget || '未选择') + '\n';
    emailBody += '补充说明：' + (fields.note || '无') + '\n';
  } else if (formType === 'sell') {
    emailBody += '车辆品牌/型号：' + (fields.car || '未填写') + '\n';
    emailBody += '行驶里程：' + (fields.mileage || '未填写') + ' 万公里\n';
    emailBody += '期望售价：' + (fields.price || '未填写') + '\n';
    emailBody += '补充说明：' + (fields.note || '无') + '\n';
  } else {
    emailBody += '经营品牌/类型：' + (fields.brand || '未填写') + '\n';
    emailBody += '所需面积：' + (fields.area || '未填写') + ' ㎡\n';
    emailBody += '补充说明：' + (fields.note || '无') + '\n';
  }

  emailBody += '\n---\n提交时间：' + new Date().toLocaleString('zh-CN') + '\n';
  emailBody += '来源：同创汽车城官网';

  // 通过 FormSubmit 免费服务发送邮件（无需注册）
  // FormSubmit 会在第一次提交时发送确认邮件到你的邮箱，确认后即可正常接收
  fetch('https://formsubmit.co/ajax/' + RECEIVER_EMAIL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      _subject: '【同创汽车城】新' + typeText + ' - ' + name + ' - ' + phone,
      _template: 'table',
      _captcha: 'false',
      '诉求类型': typeText,
      '姓名': fields.name || '',
      '联系电话': fields.phone || '',
      '意向品牌车型': formType === 'buy' ? (fields.brand || '未填写') : (formType === 'sell' ? (fields.car || '未填写') : (fields.brand || '未填写')),
      '预算/售价/面积': formType === 'buy' ? (fields.budget || '未选择') : (formType === 'sell' ? (fields.price || '未填写') : ((fields.area || '未填写') + '㎡')),
      '补充说明': fields.note || '无',
      '提交时间': new Date().toLocaleString('zh-CN')
    })
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    if (data.success) {
      showMsg('感谢提交！我们已经收到您的' + typeText + '，将尽快与您联系。', 'success');
      form.reset();
    } else {
      throw new Error(data.message || '提交失败');
    }
    btn.disabled = false;
    btn.textContent = formType === 'buy' ? '提交买车诉求' : (formType === 'sell' ? '提交卖车诉求' : '提交入驻咨询');
  })
  .catch(function() {
    // 提交失败降级：用 mailto 打开邮件客户端
    var mailSubject = encodeURIComponent('【同创汽车城】' + typeText + ' - ' + name);
    var mailBodyEncoded = encodeURIComponent(emailBody);
    window.location.href = 'mailto:' + RECEIVER_EMAIL + '?subject=' + mailSubject + '&body=' + mailBodyEncoded;
    btn.disabled = false;
    btn.textContent = formType === 'buy' ? '提交买车诉求' : (formType === 'sell' ? '提交卖车诉求' : '提交入驻咨询');
    showMsg('自动提交失败，已为您打开邮件客户端，请直接发送邮件即可。', 'error');
  });
}

// ============================================
// 显示消息
// ============================================
function showMsg(text, type) {
  var msg = document.getElementById('formMsg');
  if (!msg) return;

  msg.style.display = 'block';
  msg.style.color = type === 'success' ? '#16a34a' : '#dc2626';
  msg.style.background = type === 'success' ? '#dcfce7' : '#fee2e2';
  msg.style.padding = '12px 16px';
  msg.style.borderRadius = 'var(--radius)';
  msg.style.fontSize = '0.95rem';
  msg.textContent = text;

  if (type === 'success') {
    setTimeout(function () {
      msg.style.display = 'none';
    }, 6000);
  }
}
