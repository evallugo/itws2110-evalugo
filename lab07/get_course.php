<?php

// php to get course 
// Returns JSON data for the specified web sys course

$host = "localhost";
$user = "user"; // may need change
$pass = "NASA2110G1";  // may need change
$db = "lab7";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Database connection failed."]));

}

$sql = "SELECT CourseContent FROM Courses WHERE Title='Spooky Web Sys'";
$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()){
    header('Content-Type: application/json');
    echo $row['CourseContent'];
}

else {
    http_response_code(404);
    echo json_encode(["error" => "Course not found or no JSON data."]);
}

$conn->close();
?>