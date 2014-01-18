package Timeline::Storage::DBAccess;

use Timeline::Class::Interface;
use Timeline::Utils::DateHelper;
use Dancer::Plugin::Database;
use Date::Parse;
use HTML::Entities;
use POSIX qw(strftime);

my $dbEngine = "sqlite";
my $databaseConfig = "projectplan-".$dbEngine;

my $dbConn = database($databaseConfig);
my $simileDateFormat = "%a %b %e %Y %H:%M:%S GMT-0600";
my $defaultDateFormat = "%Y-%m-%dT%H:%M:%S+02:00";

sub getTimelineEntries {

    my ($class, $workstream, $searchpattern, $tags) = @_;
    
    # ----------------------------------------------
    # Create select statement
    # ----------------------------------------------
    
    $where = "";
    if (defined $workstream && length $workstream > 0) {
	$where .= " AND workstream_id = ".int($workstream);
    }
    
    if (defined $searchpattern && length $searchpattern > 0 && $searchpattern ne '_empty_') {
	$where .= " AND (title LIKE \'%".encode_entities($searchpattern)."%\' OR description LIKE \'%".encode_entities($searchpattern)."%\')";    
    }
    
    my @tagsArr = split(',', $tags);
    if (scalar @tagsArr > 0) {
	
	$result = "";
	for (my $i=0; $i!=scalar @tagsArr; $i++) {
	    $result .= '"'.encode_entities(@tagsArr[$i]).'"';
	    
	    if ($i < scalar @tagsArr -1) {
		$result .= ",";
	    }
	}
	
	$where .= " AND classname IN (".$result.")";
    }
    
    # ----------------------------------------------
    # Execute query
    # ----------------------------------------------

    my $query = $dbConn->prepare("SELECT event_id, workstream_id, start_date, end_date, 
	title, classname, is_active 
	FROM event WHERE is_active='Y' ".$where." ORDER BY start_date");

    $query->execute;
    
    my @entries = ();
    $rowCount = 0;
    while (my $row = $query->fetchrow_hashref) {
    
	$row->{start_date} = Timeline::Utils::DateHelper->formatDate($row->{start_date}, $simileDateFormat);
	$row->{is_duration} = "false";
	
	if (defined $row->{end_date} && length $row->{end_date} > 0) {
	    $row->{end_date} = Timeline::Utils::DateHelper->formatDate($row->{end_date}, $simileDateFormat);
	    $row->{is_duration} = "true";
	    $row->{title} = decode_entities($row->{title});
	    $row->{classname} = decode_entities($row->{classname});
	}
	
	$entries[$rowCount] = $row;
	$rowCount++;
    }
    
    return @entries;
}

sub getAllTimelineEntries {

    # ----------------------------------------------
    # Execute query
    # ----------------------------------------------

    my $query = $dbConn->prepare("SELECT classname, description, event_id as eventId, start_date as startDate, 
	end_date as endDate, title, workstream_id as workstreamId 
	FROM event ORDER BY start_date");
    
    $query->execute;
    
    my @entries = ();
    $rowCount = 0;
    while (my $row = $query->fetchrow_hashref) {
    
	$row->{startDate} = Timeline::Utils::DateHelper->formatDate($row->{startDate}, $simileDateFormat);
	$row->{is_duration} = "false";
	
	if (defined $row->{endDate} && length $row->{endDate} > 0) {
	    $row->{endDate} = Timeline::Utils::DateHelper->formatDate($row->{endDate}, $simileDateFormat);
	    $row->{is_duration} = "true";
	    $row->{description} = decode_entities($row->{description});
	    $row->{title} = decode_entities($row->{title});
	}
	
	$entries[$rowCount] = $row;
	$rowCount++;
    }
    
    return @entries;
}


sub getAllWorkstream {

    # ----------------------------------------------
    # Execute query
    # ----------------------------------------------

    my $query = $dbConn->prepare("SELECT workstream_id, name, password FROM workstream");
    
    $query->execute;
    
    my @entries = ();
    $rowCount = 0;
    while (my $row = $query->fetchrow_hashref) {
	
	$row->{workstreamId} = $row->{workstream_id};
	$row->{name} = decode_entities($row->{name});
	
	if (defined $row->{password} && length $row->{password} > 0) {
	    $row->{password} = decode_entities($row->{password});
	}
	
	delete $row->{workstream_id};
	
	$entries[$rowCount] = $row;
	$rowCount++;
    }
    
    return @entries;
}


sub getEventDetails {

    my ($class, $eventId) = @_;

    my $query = $dbConn->prepare("SELECT classname, description, event_id as eventId, 
	start_date as startDate, end_date as endDate, title, workstream_id as workstreamId 
	FROM event WHERE event_id = '".int($eventId)."'");
    
    $query->execute;
    
    while (my $row = $query->fetchrow_hashref) {

	$row->{startDate} = Timeline::Utils::DateHelper->formatDate($row->{startDate}, $defaultDateFormat);
	$row->{description} = decode_entities($row->{description});
	$row->{title} = decode_entities($row->{title});
	
	if (defined $row->{endDate} && length $row->{endDate} > 0) {
	    $row->{endDate} = Timeline::Utils::DateHelper->formatDate($row->{endDate}, $defaultDateFormat);
	} 
	else {
	    delete $row->{endDate};
	}
    
	return $row;    
    }
    
    return;
}

sub getWorkstreamIdByName {

    my ($workstreamName) = @_;

    my $query = $dbConn->prepare("SELECT workstream_id FROM workstream WHERE name='".encode_entities($workstreamName)."'");
    $query->execute;
    
    while (my $row = $query->fetchrow_hashref) {
	return $row->{workstream_id}
    }
    
    return -1;
}


sub saveEvent {

    my ($class, $eventDetails) = @_;
    
    my $existingEvent = ();
    
    if (defined $eventDetails->{eventId} && length $eventDetails->{eventId} > 0) {
	$existingEvent = getEventDetails('', $eventDetails->{eventId});
    } else {
	undef $existingEvent;
    }
    
    if (length $eventDetails->{classname} == 0) {
	$eventDetails->{classname} = "other";
    }
    
    if (length $eventDetails->{workstreamId} == 0) {
	$eventDetails->{workstreamId} = 1;
    }
    
    $endDate = 'NULL';
    if (length $eventDetails->{endDate} > 0) {
	$endDate = "'".$eventDetails->{endDate}." 23:59:59'";
    }

    # ------------------------------------------------
    # DB Action
    # ------------------------------------------------    
    if (defined $existingEvent) {

	my $query = $dbConn->prepare("UPDATE event SET start_date='".encode_entities($eventDetails->{startDate})."',
	    end_date=".$endDate.",
	    workstream_id='".int($eventDetails->{workstreamId})."',
	    title='".encode_entities($eventDetails->{title})."',
	    description='".encode_entities($eventDetails->{description})."',
	    classname='".encode_entities($eventDetails->{classname})."'
	    WHERE event_id = '".int($eventDetails->{eventId})."'");
	    
	$query->execute;
	
    }
    else {
    
	# Make sure workstream is available
	if ($eventDetails->{workstreamId} == -1) {
	    
	    if ($eventDetails->{workstreamName} eq '') {
		return;
	    }
	    
	    $autoIncrementWs = "DEFAULT";
	    if ($dbEngine eq 'sqlite') {
		$autoIncrementWs = "(SELECT IFNULL(MAX(workstream_id), 0) FROM workstream)+1";
	    }
	
	    $insertWorkstream = "INSERT INTO workstream (workstream_id, name, password) 
		VALUES(".$autoIncrementWs.", '".encode_entities($eventDetails->{workstreamName})."', '".encode_entities($eventDetails->{workstreamPassword})."')";
	    
	    my $queryWs = $dbConn->prepare($insertWorkstream);
	    $queryWs->execute;
	    
	    # Get workstream_id
	    $eventDetails->{workstreamId} = getWorkstreamIdByName($eventDetails->{workstreamName});
	    if ($eventDetails->{workstreamId} == -1) {
		return;
	    }
	}
    
	# Insert event into database
	$autoIncrement = "DEFAULT";
	if ($dbEngine eq 'sqlite') {
	    $autoIncrement = "(SELECT IFNULL(MAX(event_id), 0) FROM event)+1";
	}
    
    	$command = "INSERT INTO event (
    		event_id, 
    		workstream_id, 
    		start_date, 
    		end_date, 
    		title, 
    		classname, 
    		description, 
    		is_active
    	    ) 
    	    VALUES (
    		".$autoIncrement.", 
    		'".int($eventDetails->{workstreamId})."',
    		'".encode_entities($eventDetails->{startDate})."',
	        ".encode_entities($endDate).",
		'".encode_entities($eventDetails->{title})."',
		'".encode_entities($eventDetails->{classname})."',
		'".encode_entities($eventDetails->{description})."',
		'Y'
	)";
	
	my $query = $dbConn->prepare($command);
	
	$query->execute;
    
    }
}

sub deleteEvent {

    my ($class, $eventDetails) = @_;

    my $query = $dbConn->prepare("DELETE FROM event WHERE event_id = '".int($eventDetails->{eventId})."'");
    $query->execute;
}


1;
