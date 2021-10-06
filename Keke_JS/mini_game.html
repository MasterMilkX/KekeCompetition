<!-- popup window size game screen -->
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Level Tester - Baba is Y'all V2</title>
		<meta charset="utf-8">

		<!-- bootstrap stuff -->
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>


		<!-- main stylesheet -->
		<link rel="stylesheet" href="layout_style.css">

		<!-- extra styles -->
		<style>
			body{
				background-color: #150E16;
			}
			div{
				/*border: 1px solid black;*/
				color: var(--text);
			}

			#gameWindow{
				background-color: #150E16;
				border:2px solid;
				border-color: #00ff00;
				width: 100%;
				height: auto;
			}
			.btm_btn{
				background-color: white;
				color:black;
				border:3px solid;
				border-color: black
			}
			.btm_btn:hover{
				cursor: pointer;
			}
			.sub:hover{
				background-color: #F5E13A;
			}
			.sha:hover{
				background-color: #00fff0;
			}
			.dis{
				background-color: #565656;
				color:#676767;
			}
		</style>
		<script src="js/baba.js"></script>
		<script src="js/map.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>

		<!-- check for level in url -->
		<?php
			$hasID = false;
			$levData = array();

			//if the URL contains a specific level ID load the info
			if(isset($_GET['level']) && is_int(intval($_GET['level']))){
				$hasID = true;

				//setup database connection
				$config = parse_ini_file('../config.ini'); 
				$conn = new mysqli($config['servername'], $config['username'], $config['password'], 'baba-is-yall');
				if(!$conn){die('BAD CONNECTION');}

				// get the level with the id specified
				$select_query = $conn->prepare("SELECT ASCII_MAP, AUTHOR, SOLUTION, LEVEL_NAME from levels where LEVEL_ID = ?");
				$select_query->bind_param("i", intval($_GET['level']));
				$select_query->execute();
				$sql = $select_query->get_result();

				if(!$sql)
					die("PHP/MYSQL Error : " . $conn->error);

				//should only be one row so save the data to an array
				while($row = $sql->fetch_assoc()){	
					$levData[] = $row['ASCII_MAP'];
					$levData[] = $row['AUTHOR'];		
					$levData[] = $row['SOLUTION'];	
					$levData[] = $row['LEVEL_NAME'];	
				}
			}
		?>

		<!-- load the level data if available -->
		<script>
			var importData = "<?php echo $hasID ?>"; 
			if(importData == "1"){
				var levelData = <?php echo json_encode($levData); ?>;

				localStorage.testMap = levelData[0];
				localStorage.author = levelData[1];
				localStorage.bestSolution = (levelData[2]).toLowerCase().split("");
				localStorage.levelName = levelData[3];
			}
		</script>
	</head>
	<body onload="initEditTest()">
		<div class='container top-buffer05'>
			<!-- author header -->
			<div class='row top-buffer1' id='authorID'>
				<div class='col-xs-12 text-center' style='font-size: 1.5em' id='authorTitle'>
					Author: BABA
				</div>
			</div>
			<!-- game window -->
			<div class='row row-no-gutters'>
				<div class='col-xs-8 col-xs-offset-2 text-center'>
					<canvas width='100' height='100' id='gameWindow'>
						Game goes here. Change your browser if you see this message
					</canvas>
				</div>
			</div>
			<!-- special buttons -->
			<div class='row row-no-gutters' style='border-color:white'>
				<div class='col-xs-2 col-xs-offset-3 text-center btm_btn' id='controlCol' onclick='showControls()'>
					Show<br> Control Hints
				</div>
				<div class='col-xs-4 text-center btm_btn' id='submitCol'>
					SUBMIT<br> LEVEL
				</div>
				<div class='col-xs-2 text-center btm_btn' id='testerCol' onclick="toggleControl(this)">
					Tester:<br> HUMAN
				</div>
			</div>

			<!-- level namer -->
			<div class='row row-no-gutters top-buffer05'>
				<div class='col-xs-6 col-xs-offset-3' style='text-align: center'>
					Level name: <input type='text' width='20' id='levelNameIn' style='color:#000;display:inline-block;'> <p style='color:#f00;font-size:1.5vw;display:none' id='levelTitle'></p>
				</div>
			</div>

			<!-- share status if available -->
			<div class='row row-no-gutters top-buffer05'>
				<div class='col-xs-6 col-xs-offset-3' style='text-align: center'>
					<p id='copyStat' style='color:#fff;font-size:1vw;display:none'>Level URL Copied to clipboard!</p>
				</div>
			</div>
		</div>

		<!-- scripts -->
		<script src="js/game.js"></script>
		<script src="js/keke.js"></script>

	<!--
		<link type="text/css" rel="stylesheet" href="main_format.css"/>
		<div id="menu">
			<button onclick="window.location.href='index.php'">HOME</button>
		</div>
		<div>
			<p>Arrow Keys - Move | Space - Wait | Z - Undo Move | R - Restart Level</p>
		</div>
		<script src="js/game.js"></script>
		<script src="js/keke2.js"></script>
		
		<div style="display:inline-block;vertical-align: middle;">
			
		</div>
		<p id="debug">...</p>
	-->
	</body>
</html>