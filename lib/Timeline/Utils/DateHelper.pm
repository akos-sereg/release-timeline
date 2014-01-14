package Timeline::Utils::DateHelper;

use Date::Parse;
use POSIX qw(strftime);

# formatDate('2013-10-04 23:59:59') => 'Fri Oct 4 2013 23:59:59 GMT-06000'
# This formatting is used by SIMILE Timeline JS component.
sub formatDate {

    my ($class, $inDate, $dateFormat) = @_;
    
    $dateTime = str2time($inDate); # 2012-01-01 12:00:00 -> EPOCH integer
    $dateTimeStr = strftime $dateFormat, localtime($dateTime); # EPOCT -> Simile compatible

    return $dateTimeStr;
}

1;
