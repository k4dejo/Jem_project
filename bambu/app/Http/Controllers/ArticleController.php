<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Helpers\jwtAuthAdmin;
use Illuminate\Support\Facades\DB;
use App\article;
use Input;
use Image;
use App\outfit;
use App\size;
use App\apart;
use App\billing;
use App\purchase;
use App\Department;
use App\Gender;
class ArticleController extends Controller
{

    public function index(Request $request) {
       //listado de los articulos
        $articles = article::with(['gender'])->with(['department'])->paginate(10);
       return response()->json(array(
           'articles' => $articles,
           'status'   => 'success'
        ), 200);
    }

    public function addGenDpt($articles) {
        $dptSearch = Department::all();
        foreach ($articles as $product) {
            $dptSearch = Department::where('gender_id', $product->gender_id)
            ->where('positionDpt', $product->department)->get();
            foreach ($dptSearch as $depart) {
                if ($depart->gender_id  == $product->gender_id) {
                    if ($depart->positionDpt == $product->department) {
                        $product = article::where('id', $product->id)->update([
                            'dpt_id' => intval($depart->id)
                        ]);
                    }
                }
            }
        }
    }

    public function showPhotoProduct($id) {
        $articles = article::find($id);
        return response()->json(array(
            'productPhoto' => $articles->photo,
            'status'   => 'success'
        ), 200);
    }

    public function show($id)
    {
        $articles = article::find($id);
        $productGender = article::find($id)->gender()->get();
        $productDepartment = article::find($id)->department()->get();
        $arrayArticle = article::find($id)->sizes()->get();
        return response()->json(array(
            'articles' => $articles,
            'gender'   => $productGender,
            'department'   => $productDepartment,
            'arraySizeArticle' => $arrayArticle,
            'status'   => 'success'
        ), 200);
    }

    public function calculatePriceAllStock() {
        $products = article::with('sizes')->get();
        $totalPrice = 0;
        $totalStock = 0;
        $productsLength =  count($products);
        for ($i=0; $i < $productsLength; $i++) {
            $countSizes = count($products[$i]->sizes);
            for ($index=0; $index < $countSizes; $index++) {
                $totalStock += $products[$i]->sizes[$index]->pivot->stock;
                $totalPrice += $products[$i]->priceMajor * $products[$i]->sizes[$index]->pivot->stock;
            }
        }
        return response()->json(array(
            'totalPrice'    => $totalPrice,
            'totalStock'    => $totalStock,
            'status'   => 'success'
        ), 200);
    }

    public function caculatePriceTags($tagsId) {
        $products = article::where('tags_id', $tagsId)->with('sizes')->get();
        $totalPrice = 0;
        $totalStock = 0;
        $productsLength =  count($products);
        for ($i=0; $i < $productsLength; $i++) {
            $countSizes = count($products[$i]->sizes);
            for ($index=0; $index < $countSizes; $index++) {
                $totalStock += $products[$i]->sizes[$index]->pivot->stock;
                $totalPrice += $products[$i]->priceMajor * $products[$i]->sizes[$index]->pivot->stock;
            }
        }
        return response()->json(array(
            'Tags'          => $tagsId,
            'totalPrice'    => $totalPrice,
            'totalStock'    => $totalStock,
            'status'   => 'success'
        ), 200);

    }

    public function calculatePriceDepartment($gender, $department) {
        $products = article::where('gender', $gender)
        ->where('department', $department)->with('sizes')->get();
        $totalPrice = 0;
        $totalStock = 0;
        $productsLength =  count($products);
        for ($i=0; $i < $productsLength; $i++) {
            $countSizes = count($products[$i]->sizes);
            for ($index=0; $index < $countSizes; $index++) {
                $totalStock += $products[$i]->sizes[$index]->pivot->stock;
                $totalPrice += $products[$i]->priceMajor * $products[$i]->sizes[$index]->pivot->stock;
            }
        }
        return response()->json(array(
            'gender'        => $gender,
            'totalPrice'    => $totalPrice,
            'totalStock'    => $totalStock,
            'status'   => 'success'
        ), 200);
    }

    public function calculatePriceGender($gender) {
        $products = article::where('gender', $gender)->with('sizes')->get();
        $totalPrice = 0;
        $totalStock = 0;
        $productsLength =  count($products);
        for ($i=0; $i < $productsLength; $i++) {
            $countSizes = count($products[$i]->sizes);
            for ($index=0; $index < $countSizes; $index++) {
                $totalStock += $products[$i]->sizes[$index]->pivot->stock;
                $totalPrice += $products[$i]->priceMajor * $products[$i]->sizes[$index]->pivot->stock;
            }
        }
        return response()->json(array(
            'gender'        => $gender,
            'totalPrice'    => $totalPrice,
            'totalStock'    => $totalStock,
            'status'   => 'success'
        ), 200);
    }

    public function showForClients($id)
    {
        $articles = article::find($id);
        //$arrayArticle = article::find($id)->first()->with('sizes');
        $arrayArticle = article::find($id)->sizes()->get();
        return response()->json(array(
            'articles' => $articles,
            'arraySizeArticle' => $arrayArticle,
            'status'   => 'success'
        ), 200);
    }

    public function showSizeList($id) {
        $article = article::findOrfail($id);
        $arrayArticle = article::find($id)->sizes()->get();
        $data = array(
            'article'       => $arrayArticle,
            'status'       => 'success',
            'code'    => 200,
        );
        return response()->json($data,200);
    }

    public function filterPriceProduct($department, $priceMin, $priceMax) {
        $filterPrice = article::where('department', $department)
        ->whereBetween('pricePublic', [$priceMin, $priceMax])->get();
        $productCount = count($filterPrice);
        if ($productCount <= 0) {
            return response()->json(array(
                'filter' => $filterPrice,
                'status'   => 'void'
            ), 200);
        }
        if ($productCount > 1) {
            for ($i=0; $i < $productCount ; $i++) {
                $contents = Storage::get($filterPrice[$i]->photo);
                $filterPrice[$i]->photo = base64_encode($contents);
            }
        }else{
            $contents = Storage::get($filterPrice[0]->photo);
            $filterPrice[0]->photo = base64_encode($contents);
        }
        return response()->json(array(
            'filter' => $filterPrice,
            'status'   => 'success'
        ), 200);
    }

    public function filterSizeProductAdmin($department, $gender, $size) {
        $size2 = $size;
        $isWeb = explode('-', $size);
        $countSizes = count($isWeb);
        if($countSizes > 1) {
          $size = $isWeb[0] . '/' . $isWeb[1];
        }
        $filter = article::whereHas('sizes', function($q) use ($size) {
            $q->where('size', '=', $size);
        })->where('gender', '=', $gender)
        ->where('department', '=', $department)->with('sizes')->paginate(10);
        $productCount = count($filter);
        if ($productCount <= 0) {
            return response()->json(array(
                'filter' => $filter,
                'status'   => 'void'
            ), 200);
        }
        return response()->json(array(
            'filter'   => $filter,
            'status'   => 'success'
        ), 200);
    }

    public function filterSizeProduct($department, $gender, $size, $tagsId) {
        $size2 = $size;
        if ($tagsId != 0) {
            $filter = article::whereHas('sizes', function($q) use ($size) {
                $q->where('size', '=', $size);
                $q->where('stock', '>', 0);
            })->where('gender', '=', $gender)
            ->where('tags_id', $tagsId)
            ->where('department', '=', $department)->with('sizes')->get();
        } else {
            $filter = article::whereHas('sizes', function($q) use ($size) {
                $q->where('size', '=', $size);
                $q->where('stock', '>', 0);
            })->where('gender', '=', $gender)
            ->where('department', '=', $department)->with('sizes')->get();
        }
        $productCount = count($filter);
        if ($productCount <= 0) {
            return response()->json(array(
                'filter' => $filter,
                'status'   => 'void'
            ), 200);
        }
        return response()->json(array(
            'filter'   => $filter,
            //'NextPaginate' => $filter->nextPageUrl(),
            'status'   => 'success'
        ), 200);
    }


    public function filterTagProduct($department, $gender, $tag, $size) {
        if ($size != 'void') {
            $filter = article::whereHas('sizes', function($q) use ($size) {
                $q->where('size', '=', $size);
                $q->where('stock', '>', 0);
            })->where('gender', '=', $gender)
            ->where('tags_id', $tag)
            ->where('department', '=', $department)->with('sizes')->get();
        }else {
            $filter = article::where('gender', $gender)
            ->where('department', $department)->where('tags_id', $tag)->with('sizes')->get();
        }
        return $filter;
        $productCount = count($filter);
        return response()->json(array(
            'articles' => $filter,
            'status'   => 'success'
        ), 200);
    }

    public function getConcreteProduct($department, $gender) {
        $productConcrete = article::where('gender', $gender)
        ->where('department', $department)->with('sizes')->get();
        return response()->json(array(
            'articles' => $productConcrete,
            'status'   => 'success'
        ), 200);
    }

    public function getListProduct($department, $gender) {
        $productListEloquent = article::where('department', $department)->where('gender', $gender)
        ->has('sizes')->with('sizes')->with('department')->with('gender')->get();
        return response()->json(array(
            'articles' => $productListEloquent,
            //'NextPaginate' => $productListEloquent->nextPageUrl(),
            'status'   => 'success'
        ), 200);
    }

    public function getNewness() {
        $newness = article::orderBy('created_at', 'DESC')->take(10)->get();
        return response()->json(array(
            'newness' => $newness,
            'status'   => 'success'
        ), 200);
    }

    public function Onlydepart($gender, $department) {
        $dptGet = article::where('gender', $gender)->where('department', $department)->paginate(10);
        // $dptGet = DB::table('articles')->where('department', $department)->get();
        return response()->json(array(
            'articles' => $dptGet,
            'department' => $department,
            'status'   => 'success'
        ), 200);
    }

    public function getProductGender($gender) {
        $productGen = article::where('gender', '=', $gender)->paginate(10);
        $productCount = count($productGen);
        return response()->json(array(
            'articles' => $productGen,
            'status'   => 'success'
        ), 200);
    }

    function support_webp(): bool {
        return isset($_SERVER['HTTP_ACCEPT']) &&
        strpos($_SERVER['HTTP_ACCEPT'], 'image/webp') !== false;
    }

    public function store(Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);
        if ($checkToken) {
            // recoger datos del POST
            $json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);
            //validacion
            $validate = \Validator::make($paramsArray, [
                'name'        => 'required',
                'detail'      => 'required',
                'pricePublic' => 'required',
                'priceMajor'  => 'required',
                'priceTuB'    => 'required',
                'department'  => 'required',
                'weight'      => 'required',
                'photo'       => 'required',
                'gender'      => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            //añadir verificacion de guardado del producto antes que la imagen
            $img =  $params->file;
            $isWebP = explode(';', $img);
            if ($isWebP[0] === "data:image/webp") {
                $img = str_replace('data:image/webp;base64,', '', $img);
                $img = str_replace(' ', '+', $img);
                $img = 'data:image/jpeg;base64,'. $img;
                $this->support_webp();
                $imgName = time() . $params->name . ".webp";
                $path = public_path('\storage\/'. $imgName);
                $base = imagecreatefromwebp($img);
                //header('Content-type: image/webp');
                $imgConvert = Image::make($base)->save($path);
            } else {
                $img = str_replace('data:image/jpeg;base64,', '', $img);
                $img = str_replace(' ', '+', $img);
                //$imgName = time() . $params->photo;
                $imgName = time() . $params->name . ".webp";
                $base = base64_decode($img);
                //$imgConvert = Image::make($base)->encode('jpg', 100);
                $path = public_path('\storage\/'. $imgName);
                $imgConvert = Image::make($base)->encode('webp', 85)->save($path);
                //Storage::disk('public')->put($imgName, $imgConvert);
            }
            //guardar articulo
            $article = new article();
            $article->name         = $params->name;
            $article->detail       = $params->detail;
            $article->pricePublic  = $params->pricePublic;
            $article->priceMajor   = $params->priceMajor;
            $article->priceTuB     = $params->priceTuB;
            $article->department   = $params->department;
            $article->weight       = $params->weight;
            $article->photo        = $imgName;
            $article->gender       = $params->gender;
            $article->gender_id    = $params->gender;
            $article->dpt_id       = $params->department;
            if ($params->tags_id != 0) {
                $article->tags_id     = $params->tags_id;
            }

            $article->save();
            $data = array(
                'article' => $article ,
                'status'  => 'success',
                'code'    => 200,
            );
        } else {
            // Error
            $data = array(
                'message' => 'login incorrecto',
                'status' => 'Error',
                'code'  => 400,
            );
        }
        return response()->json($data, 200);
    }

    /*public function store(Request $request) {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);
        if ($checkToken) {
            // recoger datos del POST
            $json =  $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json,true);
            //validacion
            $validate = \Validator::make($paramsArray, [
                'name'        => 'required',
                'detail'      => 'required',
                'pricePublic' => 'required',
                'priceMajor'  => 'required',
                'priceTuB'    => 'required',
                'department'  => 'required',
                'weight'      => 'required',
                'photo'       => 'required',
                'gender'      => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }
            //añadir verificacion de guardado del producto antes que la imagen
            $img =  $params->file;
            $isWebP = explode(';', $img);
            if ($isWebP[0] === "data:image/webp") {
                //return $isWebP;
                $img = str_replace('data:image/webp;base64,', '', $img);
                $img = str_replace(' ', '+', $img);
            } else {
                $img = str_replace('data:image/jpeg;base64,', '', $img);
                $img = str_replace(' ', '+', $img);
            }
            $imgName = time() . $params->photo;
            //$resized_image = Image::make(base64_decode($img))->stream('jpg', 100);
            $base = base64_decode($img);
            $imgConvert = Image::make($base)->encode('jpg', 100);
            Storage::disk('public')->put($imgName, $imgConvert);
            //Storage::disk('public')->put($imgName, base64_decode($img));
            //guardar articulo
            $article = new article();
            $article->name         = $params->name;
            $article->detail       = $params->detail;
            $article->pricePublic  = $params->pricePublic;
            $article->priceMajor   = $params->priceMajor;
            $article->priceTuB     = $params->priceTuB;
            $article->department   = $params->department;
            $article->weight       = $params->weight;
            $article->photo        = $imgName;
            $article->gender       = $params->gender;
            $article->gender_id    = $params->gender;
            $article->dpt_id       = $params->department;
            if ($params->tags_id != 0) {
                $article->tags_id     = $params->tags_id;
            }

            $article->save();
            $data = array(
                'article' => $article ,
                'status'  => 'success',
                'code'    => 200,
            );
        } else {
            // Error
            $data = array(
                'message' => 'login incorrecto',
                'status' => 'Error',
                'code'  => 400,
            );
        }
        return response()->json($data, 200);
    }*/

    public function update($id, Request $request)
    {
        $hash = $request->header('Authorization', null);
        $jwtAuthAdmin = new jwtAuthAdmin();
        $checkToken = $jwtAuthAdmin->checkToken($hash);

        if ($checkToken) {
            $json = $request->input('json', null);
            $params = json_decode($json);
            $paramsArray = json_decode($json, true);
            //validacion
            $validate = \Validator::make($paramsArray, [
                'name'        => 'required',
                'detail'      => 'required',
                'pricePublic' => 'required',
                'priceMajor'  => 'required',
                'priceTuB'    => 'required',
                'department'  => 'required',
                'weight'      => 'required',
                'photo'       => 'required',
                'gender'      => 'required'
            ]);
            if ($validate->fails()) {
                return response()->json($validate->errors(),400);
            }

            $imgDB = article::where('id', $id)->first();
            $lengthImg = strlen($params->photo);
            $isWeb = explode(':', $params->photo);
            $paramsArray['gender_id'] = $params->gender;
            $paramsArray['dpt_id'] =  intval($params->department);
            unset($paramsArray['amount']);
            unset($paramsArray['size']);
            if ($isWeb[0] == 'https') {
                $imgName = time() . $params->photo;
                unset($paramsArray['id']);
                unset($paramsArray['created_at']);
                unset($paramsArray['file']);
                unset($paramsArray['photo']);
                $article = article::where('id', $id)->update($paramsArray);
            } else {
                $img =  $params->file;
                $isWebP = explode(';', $img);
                if ($isWebP[0] === "data:image/webp") {
                    $img = str_replace('data:image/webp;base64,', '', $img);
                    $img = str_replace(' ', '+', $img);
                    $img = 'data:image/jpeg;base64,'. $img;
                    $this->support_webp();
                    $imgName = time() . $params->name . ".webp";
                    $path = public_path('\storage\/'. $imgName);
                    $base = imagecreatefromwebp($img);
                    $paramsArray['photo'] = $imgName;
                    unset($paramsArray['id']);
                    unset($paramsArray['created_at']);
                    unset($paramsArray['file']);
                    \Storage::disk('public')->delete($imgDB->photo);
                    $imgConvert = Image::make($base)->save($path);
                    $article = article::where('id', $id)->update($paramsArray);
                } else {
                    $img = str_replace('data:image/jpeg;base64,', '', $img);
                    $img = str_replace(' ', '+', $img);
                    $imgName = time() . $params->name . ".webp";
                    $base = base64_decode($img);
                    $path = public_path('\storage\/'. $imgName);
                    $paramsArray['photo'] = $imgName;
                    unset($paramsArray['id']);
                    unset($paramsArray['created_at']);
                    unset($paramsArray['file']);
                    \Storage::disk('public')->delete($imgDB->photo);
                    $imgConvert = Image::make($base)->encode('webp', 85)->save($path);
                    $article = article::where('id', $id)->update($paramsArray);
                }
            }
            // Actualizar datos del articulo
            $data = array(
                'article' => $paramsArray,
                'status'  => 'success',
                'code'    => 200
            );
        } else {
            //Error
            $data = array(
                'message' => 'login incorrecto',
                'status' => 'Error',
                'code'  => 400,
            );
        }

        return response()->json($data, 200);
    }

    public function destroy($id, Request $request){

        //comprobar resgitro
        $article = article::find($id);
        //Borrar registro
        $route = public_path().'\catalogo'.'\/';
        $imgRoute = str_replace('/', '', $route);
        $imgRoute = $imgRoute . $article->photo;
        Storage::disk('public')->delete($article->photo);
        $article->apart()->sync([]);
        $article->purchases()->update(['article_id' => null]);
        $article->clients()->detach($id);
        $article->billing()->sync([]);
        $article->billing()->sync([]);
        $article->outfit()->sync([]);
        $article->sizes()->sync([]);
        $article->delete();

        $data = array(
            'article' => $article,
            'status'  => 'success',
            'code'    => 200
        );
        return response()->json($data, 200);
    }
}
