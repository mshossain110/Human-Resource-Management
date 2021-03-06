<?php
namespace HRM\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Skill extends Eloquent {

    protected $primaryKey = 'id';
    protected $table      = 'hrm_personal_skill';
    public $timestamps    = false;

    protected $fillable = [
		'employee_id',
		'skill',
		'years_of_exp',
		'comments',
		'created_by',
		'updated_by'
    ];
}

