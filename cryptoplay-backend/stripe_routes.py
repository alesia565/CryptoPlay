from flask import Blueprint, request, jsonify
import stripe

stripe_routes = Blueprint('stripe_routes', __name__)

stripe.api_key = "TU_CLAVE_TEST_AQUI"  # luego la pasamos a .env

@stripe_routes.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    data = request.get_json()

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        mode="payment",
        line_items=[{
            "price": data["priceId"],
            "quantity": 1
        }],
        success_url="http://localhost:8081/success",
        cancel_url="http://localhost:8081/cancel"
    )

    return jsonify({"url": session.url})