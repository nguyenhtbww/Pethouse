<div style="border: 3px solid green; padding: 15px; background: lightgreen; width: 600px; margin: auto;">
    <h3> Xin chào, {{$user['name']}} </h3>
    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại Peshouse. Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
    <p>
        <a href="{{$user['link']}}"
            style="display: inline-block; padding: 7px 25px; color: #fff; background: darkblue;">Nhấn vào đây để
            đổi lại mật khẩu</a>
    </p>
</div>