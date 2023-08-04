"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory,Blueprint
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
#from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type = True)
db.init_app(app)

# Allow CORS requests to this API
CORS(app)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
jwt = JWTManager(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0 # avoid cache memory
    return response

# @api.route('/characters', methods=['GET','POST'])
# def get_post_characters():
#     if request.method == "GET":
#         characters_query = Character.query.all()
#         characters = list(map(lambda character:character.serialize(),characters_query))
#         response_body = {
#             "msg": "ok",
#             "results": characters
#         }
#         return jsonify(response_body), 200
    
#     elif request.method == "POST":
#         request_body = request.get_json(force=True)
#         character = Character(name=request_body["name"],height=request_body["height"],mass=request_body["mass"],hair_color=request_body["hair_color"],skin_color=request_body["skin_color"],eye_color=request_body["eye_color"],birth_year=request_body["birth_year"],gender=request_body["gender"])
#         if character is None:
#             return jsonify({"msg":"Character no puede ser null"}),400
#         if "name" not in request_body:
#             return jsonify({"msg":"name no puede ser null"}),400
#         db.session.add(character)
#         db.session.commit()
#         response_body = {
#             "msg" : "ok - Character created"
#         }
#         return jsonify(response_body), 200

# @api.route('/characters/<int:character_id>', methods=['GET','DELETE'])
# def get_delete_one_character(character_id):
#     character_query = Character.query.filter_by(id=character_id).first()

#     if character_query is None:
#         return jsonify({"msg" : "Character not found"}),404

#     elif request.method == "GET":
#         response_body = {
#             "msg": "ok",
#             "result" : character_query.serialize()
#         }
#         return jsonify(response_body), 200
    
#     elif request.method == "DELETE":
#         response_body = {
#             "msg": "ok - Character deleted"
#         }
#         db.session.delete(character_query)
#         db.session.commit()
#         return jsonify(response_body), 200

# @api.route('/planets', methods=['GET','POST'])
# def get_post_planets():
#     if request.method == "GET":
#         planets_query = Planet.query.all()
#         planets = list(map(lambda planet:planet.serialize(),planets_query))
#         response_body = {
#             "msg": "ok",
#             "results": planets
#         }
#         return jsonify(response_body), 200

#     elif request.method == "POST":
#         request_body = request.get_json(force=True)
#         planet = Planet(name=request_body["name"],rotation_period=request_body["rotation_period"],orbital_period=request_body["orbital_period"],diameter=request_body["diameter"],climate=request_body["climate"],gravity=request_body["gravity"],terrain=request_body["terrain"],surface_water=request_body["surface_water"],population=request_body["population"])
#         if planet is None:
#             return jsonify({"msg":"Planet cannot be null"})
#         if "name" not in request_body:
#             return jsonify({"msg":"name cannot be null"}),404
#         db.session.add(planet)
#         db.session.commit()
#         response_body = {
#             "msg" : "ok - Planet created"
#         }
#         return jsonify(response_body), 200

# @api.route('/planets/<int:planet_id>', methods=['GET','DELETE'])
# def get_delete_one_planet(planet_id):
#     planet_query = Planet.query.filter_by(id=planet_id).first()

#     if planet_query is None:
#         return jsonify({"msg" : "Planet not found"}),404

#     elif request.method == "GET":
#         response_body = {
#             "msg": "ok",
#             "result" : planet_query.serialize()
#         }
#         return jsonify(response_body), 200
    
#     elif request.method == "DELETE":
#         response_body = {
#             "msg": "ok - Planet deleted"
#         }
#         favorites_query = Favorite
#         db.session.delete(planet_query)
#         db.session.commit()
#         return jsonify(response_body), 200

# @api.route('/favorites', methods=['GET','POST'])
# def get_post_favorites():
#     if request.method == "GET":
#         favorites_query = Favorite.query.all()
#         favorites = list(map(lambda favorite:favorite.serialize(),favorites_query))
#         response_body = {
#             "msg": "ok",
#             "results": favorites
#         }
#         return jsonify(response_body), 200
    
#     elif request.method == "POST":
#         request_body = request.get_json(force=True)
#         exists = Favorite.query.filter_by(user_id=request_body["user_id"],character_id=request_body["character_id"],planet_id=request_body["planet_id"]).first()
#         if exists != None:
#             return jsonify({"msg":"Already exists"}),400
#         favorite = Favorite(user_id=request_body["user_id"],character_id=request_body["character_id"],planet_id=request_body["planet_id"])
#         if favorite.user_id is None:
#             return jsonify({"msg":"No user was selected"}),400
#         if favorite.character_id is None and favorite.planet_id is None:
#             return jsonify({"msg":"No character or planet was selected"}),400
#         if favorite.character_id is not None and favorite.planet_id is not None:
#             return jsonify({"msg":"Multiple items selected"}),400
#         db.session.add(favorite)
#         db.session.commit()
#         response_body = {
#             "msg" : "ok - Favorite created"
#         }
#         return jsonify(response_body), 200

# @api.route('/favorites/<int:favorite_id>', methods=['GET','DELETE'])
# def get_delete_one_favorite(favorite_id):
#     favorite_query = Favorite.query.filter_by(id=favorite_id).first()

#     if favorite_query is None:
#         return jsonify({"msg" : "Favorite not found"}),404

#     elif request.method == "GET":
#         response_body = {
#             "msg": "ok",
#             "result" : favorite_query.serialize()
#         }
#         return jsonify(response_body), 200

#     elif request.method == "DELETE":
#         response_body = {
#             "msg": "ok - Favorite deleted"
#         }
#         db.session.delete(favorite_query)
#         db.session.commit()
#         return jsonify(response_body), 200


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
