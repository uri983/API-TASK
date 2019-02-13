<?
$users=array(
 0=>array(
  "Wicho en tu boca",
  "http://open.subinsb.com/data/1/img/avatar",
  "wichin"
 ),
 1=>array(
  "la bonita",
  "http://open.subinsb.com/data/3/img/avatar",
  "putin"
 )
);
$q=htmlspecialchars($_POST['q']);
if(isset($_POST['q'])){
 $frs=array();
 if($q!=""){
  foreach($users as $k=>$v){
   if(preg_match("#".$q."#i", $v[0])){
    $frs[$k]['id']=$v[2];
    $frs[$k]['name']=$v[0];
    $frs[$k]['avatar']=$v[1];
   }
  }
 }
 echo json_encode($frs);
}
?>
