import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function LienHe() {
    useEffect(() => {
        // Khởi tạo bản đồ Google
        const initializeMap = () => {
            const mapOptions = {
                center: new window.google.maps.LatLng(10.853162580208462, 106.62685899715075), // Tọa độ mong muốn
                zoom: 15, // Độ phóng to của bản đồ
                mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            };
            const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);

            // Tạo dấu chỉ (marker)
            const marker = new window.google.maps.Marker({
                position: { lat: 10.853162580208462, lng: 106.62685899715075 }, // Tọa độ của marker
                map: map,
                title: 'Địa điểm của chúng tôi', // Tiêu đề cho marker
            });
        };

        // Tải script Google Maps và khởi tạo bản đồ
        if (window.google && window.google.maps) {
            initializeMap();
        } else {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
            script.async = true;
            script.onload = initializeMap;
            document.body.appendChild(script);
        }
    }, []);

    // Liên hệ
    const [formData, setFormData] = useState({
        MaLienHe: 1, // Bạn có thể cập nhật giá trị này theo cách phù hợp
        TieuDe: '',  // Trường tiêu đề
        HoVaTen: '',
        SoDienThoai: '',
        Email: '',
        NoiDung: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/contacts/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Error details:', data);
                alert(`Lỗi: ${data.message || 'Có lỗi xảy ra'}`);
                return;
            }

            if (data.status === 'success') {
                alert('Gửi liên hệ thành công!');
                setFormData({
                    MaLienHe: 1,
                    TieuDe: '',
                    HoVaTen: '',
                    SoDienThoai: '',
                    Email: '',
                    NoiDung: '',
                });
            } else {
                alert('Gửi liên hệ không thành công.');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Đã xảy ra lỗi khi gửi biểu mẫu.');
        }
    };


    return (
        <>
            <div className="page-title parallax parallax1">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-light">
                            <div className="page-title-heading">
                                <h1 className="title">Liên hệ</h1>
                            </div>
                            <div className="breadcrumbs">
                                <ul className="px-0">
                                    <li><Link to="/">Trang chủ</Link></li>
                                    <li><Link to="/lienhe">Liên hệ</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nội dung trang liên hệ */}
            <section className="flat-row flat-iconbox">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="title-section">
                                <h2 className="title">Liên hệ</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="iconbox text-center">
                                <div className="box-header nomargin">
                                    <div className="icon">
                                        <i className="fa-solid fa-map-marker" />
                                    </div>
                                </div>
                                <div className="box-content">
                                    <p>Tô ký, phường Trung Mỹ Tây, quận 12, TP.HCM</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="divider h0" />
                            <div className="iconbox text-center">
                                <div className="box-header">
                                    <div className="icon">
                                        <i className="fa-solid fa-phone" />
                                        
                                    </div>
                                </div>
                                <div className="box-content">
                                    <p>0789482587</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="divider h0" />
                            <div className="iconbox text-center">
                                <div className="box-header">
                                    <div className="icon">
                                        <i className="fa fa-envelope" />
                                    </div>
                                </div>
                                <div className="box-content">
                                    <p>pethose@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="flat-row flat-contact">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="title-section margin_bottom_17">
                                <h2 className="title">Liên hệ cho chúng tôi</h2>
                            </div><br/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="wrap-contact style2">
                            <form
                                onSubmit={handleSubmit}
                                noValidate=""
                                className="contact-form"
                                id="contactform"
                                method="post"
                                action="#"
                            >
                                <div className="form-text-wrap clearfix row">
                                    <div className="contact-name col-12">
                                        <label />
                                        <input
                                            type="text"
                                            placeholder="Bạn cần hỗ trợ"
                                            aria-required="true"
                                            size={30}
                                            name="TieuDe"
                                            id="author"
                                            value={formData.TieuDe}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="contact-name col-6">
                                        <label />
                                        <input
                                            type="text"
                                            placeholder="Nhập tên của bạn"
                                            aria-required="true"
                                            size={30}
                                            name="HoVaTen"
                                            id="author"
                                            value={formData.HoVaTen}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    
                                    <div className="contact-name col-6">
                                        <label />
                                        <input
                                            type="text"
                                            placeholder="Nhập số điện thoại của bạn"
                                            aria-required="true"
                                            size={30}
                                            name="SoDienThoai"
                                            id="author"
                                            value={formData.SoDienThoai}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="contact-name col-6">
                                        <label />
                                        <input
                                            type="text"
                                            placeholder="Nhập Email của bạn"
                                            aria-required="true"
                                            size={30}
                                            name="Email"
                                            id="author"
                                            value={formData.Email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="contact-message clearfix row">
                                    <label />
                                    <textarea
                                        placeholder="Nội dung"
                                        name="NoiDung"
                                        required=""
                                        value={formData.NoiDung}
                                            onChange={handleChange}
                                    />
                                </div>
                                <div className="form-submit">
                                    <button type="submit" className="contact-submit">Gửi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="flat-row flat-map fix-padding" style={{ height: '600px' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div id="map" style={{ height: '600px', width: '100%' }}></div> {/* Tăng chiều cao và kích thước của bản đồ */}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default LienHe;
