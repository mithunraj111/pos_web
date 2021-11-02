<template>
    <div>
		<OrangeLabelBanner />
        <div class="contact container">
            <div class="col-70" style="padding-right: 20px">
                <div class="map-container">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8562.596937014418!2d-3.464480986034111!3d56.071520769414015!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xcea13c5afe328302!2skockraco!5e1!3m2!1sen!2sin!4v1632633532131!5m2!1sen!2sin" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                </div>
                <div class="card" style="margin-top:30px">
                    <div class="card-header">DELIVERY INFORMATION</div>
                    <div class="card-body">
                        <p>We offer home delivery under the following order conditions:</p>
                        <table>
                            <tr>
                                <th>Mileage</th>
                                <th>Minimum Order *</th>
                                <th>Delivery Charge</th>
                            </tr>
                            <tr>
                                <td>Up to 3 miles</td>
                                <td>£10.00</td>
                                <td>£2.00</td>
                            </tr>
                            <tr>
                                <td>Up to 4 miles</td>
                                <td>£10.00</td>
                                <td>£3.00</td>
                            </tr>
                            <tr>
                                <td>Up to 5 miles</td>
                                <td>£10.00</td>
                                <td>£4.00</td>
                            </tr>
                        </table>
                        <p>*<span class="red-label">NOTE</span>If you are ordering from outside the 5 mile radius please call the shop on 01383 623409.</p>
                        <p>*<span class="orange-label">NOTE</span>You must spend at least this amount on the items, after discount, excluding any delivery or processing fees.</p>
                        
                    </div>
                </div>
            </div>
            <div class="col-30">
                <div class="card">
                    <div class="card-header">COMPANY INFORMATION</div>
                    <div class="card-body">
                        <div style="font-weight:800; margin:0 0 5px">KOCKRACO DUNFERMLINE</div>
                        <p>Our Address<br/>26, Bruce Street,<br/>Dunfermline<br/>Fife<br/>KY12 7AG</p>
                        <div style="font-weight:800; margin:10px 0 5px">Our Contact Information</div>
                        <p>01383 623409</p>
                        <p>info@kockraco.co.uk</p>
                    </div>
                </div>
                <div class="card" style="margin-top:30px">
                    <div class="card-header">OPENING HOURS</div>
                    <div class="card-body">
                        <table>
                            <tr>
                                <td>Monday</td>
                                <td>CLOSED</td>
                            </tr>
                            <tr>
                                <td>Tuesday</td>
                                <td>4:00pm - 11:00pm</td>
                            </tr>
                            <tr>
                                <td>Wednesday</td>
                                <td>4:00pm - 11:00pm</td>
                            </tr>
                            <tr>
                                <td>Thursday</td>
                                <td>4:00pm - 11:00pm</td>
                            </tr>
                            <tr>
                                <td>Friday</td>
                                <td>4:00pm - 11:00pm</td>
                            </tr>
                            <tr>
                                <td>Saturday</td>
                                <td>4:00pm - 11:00pm</td>
                            </tr>
                            <tr>
                                <td>Sunday</td>
                                <td>4:00pm - 11:00pm</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.contact{
    margin: 50px auto;
    display: flex;
    .map-container{
        background-image: url('https://www.kockraco.co.uk/myimages/978/zpos-bg-Kockraco_WhiteBG3.jpg');
        padding: 20px;
    }
    .card{
        box-shadow: 0 1px 3px #000;
        .card-header{
            background: #303034;
            color: #ffffff;
            font-weight: 800;
            padding: 15px;
        }
        .card-body{
            background: #ffffff;
            padding: 15px;
            line-height: 1.6;
            table{
                border-collapse: collapse;
                width: 100%;
                margin: 20px auto;
                th, td{
                    padding: 6px 10px;
                    text-align: left;
                    border: 1px solid #ccc;
                }
            }
            .red-label, .orange-label{
                color: #ffffff;
                font-size: 10px;
                padding: 3px 5px;
                position: relative;
                top: -3px;
                margin: 0 3px;
                text-shadow: 1px 1px #000;
            }
            .red-label{
                background: #D42526;
            }
            .orange-label{
                background: #EA6C12;
            }
        }
    }
}
</style>
<script lang="ts">
import Vue from 'vue'
import OrangeLabelBanner from "../components/OrangeBanner.vue";
export default Vue.extend({
    components: {
      OrangeLabelBanner,
    }
})
</script>