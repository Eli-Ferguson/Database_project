<?php

define('__BACKEND_ROOT__', $_SERVER['DOCUMENT_ROOT'] . '/backend');
require_once($_SERVER['DOCUMENT_ROOT'] . '/backend/models/Constants.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/../config/Config.class.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/backend/dao/DBConnection.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/backend/models/Survey.php');

$data = json_decode(file_get_contents("php://input"), true);
$conn = new DBConnection(new Config());

function getMetaData($conn, $data)
{
    if ($stmt = $conn->prepare(
        "SELECT `survey_id`, `title`, `description`, `start_date`, `end_date`, `number_of_questions`
        FROM `surveys_metadata` 
        WHERE `survey_id` = ?"
    )) {
        $stmt->bind_param('i', $data['survey_id']);
        $stmt->execute();
        $rs = $stmt->get_result();
        $metadata = $rs->fetch_assoc();
    }
    return $metadata;
}

// Get all surveys for which email is eq to author col in surveys metadata
function getAuthoredSurveyMetadata($conn, $data)
{
    $survey_metadata = array();
    if ($stmt = $conn->prepare(
        "SELECT `survey_id`
        FROM `surveys_metadata` 
        WHERE `author` = ?"
    )) {
        $stmt->bind_param('s', $data['email']);
        $stmt->execute();
        $rs = $stmt->get_result();
        while ($row = $rs->fetch_assoc()) {
            array_push(
                $survey_metadata,
                getMetaData($conn, $row)
            );
        }
    }
    return $survey_metadata;
}

$authored = getAuthoredSurveyMetadata($conn, $data) ?? array();

// Get all surveys for which email is participant
function getParticipantSurveyMetadata($conn, $data)
{
    if ($stmt = $conn->prepare(
        "SELECT `survey_id`
        FROM `participants` 
        WHERE `email` = ?"
    )) {
        $stmt->bind_param('s', $data['email']);
        $stmt->execute();
        $rs = $stmt->get_result();
        $survey_id_list = array();
        while ($row = $rs->fetch_assoc()) {
            array_push(
                $survey_id_list,
                $row['survey_id']
            );
        }
        $stmt->close();
        $conn->next_result();
    }

    $metadata = array();
    foreach ($survey_id_list as $survey_id) {
        $stmt = $conn->prepare(
            "SELECT `status`
            FROM `participants`
            WHERE `survey_id` = ?
            AND `email` = ?"
        );
        $stmt->bind_param('is', $survey_id, $data['email']);
        $stmt->execute();
        $rs = $stmt->get_result();
        $status = $rs->fetch_assoc();
        $stmt->close();
        $conn->next_result();
        $temp = getMetaData($conn, array("survey_id" => $survey_id)) ?? array();
        $temp["status"] = $status['status'];
        array_push($metadata, $temp);
    }
    return $metadata;
}

$participant = getParticipantSurveyMetadata($conn, $data) ?? array();

$ret = ['authored' => $authored, 'participant' => $participant];

echo json_encode($ret);
