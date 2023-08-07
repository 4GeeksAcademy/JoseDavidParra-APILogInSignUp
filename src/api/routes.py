"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# ----- ENDPOINTS ------ 

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    if email is None or password is None:
        return jsonify({"msg":"Missing data"}),404
    
    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"msg":"User does not exist"}),404
    
    if password != user.password:
        return jsonify({"msg":"Wrong password"}),404
    
    if user.is_active is False:
        return jsonify({"msg":"User is not active"}),401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@api.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    if user is None:
        return jsonify({"token":current_user})
    else:
        # jsonify(logged_in_as=user.serialize()), 200
        return jsonify({"token":True}),200

@api.route("/signup",methods=['POST'])
def signup():
        request_body = request.get_json(force=True)

        if "is_active" not in request_body:
            request_body.update({"is_active":True})

        if "email" not in request_body:
            return jsonify({"msg":"email no puede estar vacio"}),400
        
        exists = User.query.filter_by(email=request_body["email"]).first()

        if exists is not None:
            return jsonify({"msg":"User already exists"}),400
        
        if "password" not in request_body:
            return jsonify({"msg":"password no puede estar vacio"}),400
        
        user = User(email=request_body["email"],password=request_body["password"],is_active=request_body["is_active"])

        db.session.add(user)
        db.session.commit()
        response_body = {
            "msg" : "ok - User created"
        }
        return jsonify(response_body), 201
